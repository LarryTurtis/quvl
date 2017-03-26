var wrapTags = require('../app/dao/wrapTags.js');

var chai = require('chai');
var sinon = require('sinon');
var should = chai.should;
var expect = chai.expect;

describe('Wrap Tags', () => {

  describe('start and end in same node', () => {
    var doc = '<div><p data-range="0-12">123 abc hello</p><p data-range="13-19">456 789</p></div><p data-range="20-23">blah</p>';
    var operations = [{
      start: 7,
      end: 9
    }];
    it('should wrap the right tags', () => {
      var result = wrapTags.wrap(doc, operations);
      expect(result).to.equal(
        '<div>' + 
          '<p>' +
            '<span data-range="0-6">123 abc</span>' +
            '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="7-9"> he</quvl-tag>' +
            '<span data-range="10-12">llo</span>' +
          '</p>' +
          '<p data-range="13-19">' +
            '456 789' +
          '</p>' + 
        '</div>' + 
        '<p data-range="20-23">' +
          'blah' +
        '</p>');
      });
    });

    describe('start and end in different nodes', () => {
      var doc = '<div><p data-range="0-12">123 abc hello</p><p data-range="13-19">456 789</p></div><p data-range="20-23">blah</p>';
      var operations = [{
        start: 7,
        end: 15
      }];
      it('should wrap the right tags', () => {
        var result = wrapTags.wrap(doc, operations);
        expect(result).to.equal(
          '<div>' + 
            '<p>' +
              '<span data-range="0-6">123 abc</span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="7-12"> hello</quvl-tag>' +
            '</p>' +
            '<p>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="13-15">456</quvl-tag>' +
              '<span data-range="16-19"> 789</span>' +
            '</p>' + 
          '</div>' + 
          '<p data-range="20-23">' +
            'blah' +
          '</p>'
        );
      });
    });

    describe('multiple same node', () => {
      var doc = '<div><p data-range="0-12">123 abc hello</p><p data-range="13-19">456 789</p></div><p data-range="20-23">blah</p>';
      var operations = [{
        start: 7,
        end: 9
      },{
        start: 15,
        end: 18
      }];
      it('should wrap the right tags', () => {
        var result = wrapTags.wrap(doc, operations);
        expect(result).to.equal(
          '<div>' + 
            '<p>' +
              '<span data-range="0-6">123 abc</span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="7-9"> he</quvl-tag>' +
              '<span data-range="10-12">llo</span>' +
            '</p>' +
            '<p>' +
              '<span data-range="13-14">45</span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="15-18">6 78</quvl-tag>' +
              '<span data-range="19-19">9</span>' +
            '</p>' + 
          '</div>' + 
          '<p data-range="20-23">' +
            'blah' +
          '</p>');
        });
      });

    describe('multiple cross node', () => {
      var doc = '<div><p data-range="0-12">123 abc hello</p><p data-range="13-19">456 789</p></div><p data-range="20-23">blah</p>';
      var operations = [{
        start: 7,
        end: 15
      },{
        start: 18,
        end: 20
      }];
      it('should wrap the right tags', () => {
        var result = wrapTags.wrap(doc, operations);
        expect(result).to.equal(
          '<div>' + 
            '<p>' +
              '<span data-range="0-6">123 abc</span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="7-12"> hello</quvl-tag>' +
            '</p>' +
            '<p>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="13-15">456</quvl-tag>' +
              '<span>' + 
                '<span data-range="16-17"> 7</span>' +
                '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="18-19">89</quvl-tag>' +
              '</span>' +
            '</p>' + 
          '</div>' + 
          '<p>' +
            '<quvl-tag data-author-id="*" data-comment-id="*" ' + 'data-range="20-20">b</quvl-tag>' +
            '<span data-range="21-23">lah</span>' +
          '</p>'
        );
      });
    });

    describe("line breaks", () => {
      var doc = '<p data-range="0-6">my butt</p>' +
                '<span data-range="7-7">\n</span>' +
                '<p>' +
                  '<span data-range="8-10">is </span>' +
                  '<strong data-range="11-14">very</strong>' +
                  '<span data-range="15-20"> round</span>' +
                '</p>';

      var operations = [{
        "start":14,"end":14
      }];

      it('should wrap the right tags', () => {
        var result = wrapTags.wrap(doc, operations);
        expect(result).to.equal(
          '<p data-range="0-6">my butt</p>' +
          '<span data-range="7-7">\n</span>' +
          '<p>' +
            '<span data-range="8-10">is </span>' +
            '<strong>' + 
              '<span data-range="11-13">ver</span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" data-range="14-14">y</quvl-tag>' +
            '</strong>' +
            '<span data-range="15-20"> round</span>' +
          '</p>'
        );
      });
    });

    describe("line breaks with multiple insertions", () => {
      var doc = '<p data-range="0-6">my butt</p>' +
                '<span data-range="7-7">\n</span>' +
                '<p>' +
                  '<span data-range="8-10">is </span>' +
                  '<strong data-range="11-14">very</strong>' +
                  '<span data-range="15-20"> round</span>' +
                '</p>';

      var operations = [{
        "start":14,"end":14
      }, {
        "start": 15,"end": 18
      }];

      it('should wrap the right tags', () => {
        var result = wrapTags.wrap(doc, operations);
        expect(result).to.equal(
          '<p data-range="0-6">my butt</p>' +
          '<span data-range="7-7">\n</span>' +
          '<p>' +
            '<span data-range="8-10">is </span>' +
            '<strong>' + 
              '<span data-range="11-13">ver</span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" data-range="14-14">y</quvl-tag>' +
            '</strong>' +
            '<span>' +
              '<quvl-tag data-author-id="*" data-comment-id="*" data-range="15-18"> rou</quvl-tag>' +
              '<span data-range="19-20">nd</span>' +
            '</span>' +
          '</p>'
        );
      });
    });
});

