var setRanges = require('../app/dao/setRanges.js');

var chai = require('chai');
var sinon = require('sinon');
var should = chai.should;
var expect = chai.expect;
var operation1, operation2, attempt, operations, requested;

describe('Set Ranges', () => {

  var doc = '<div>' + 
  				'<p>123 abc hello</p>' +
  				'<p>456 789</p>' +
  			'</div>' +
  			'<p>blah</p>';

  describe('simple', () => {
    it('should return correct ranges', () => {
      result = setRanges(doc);
      expect(result).to.equal(
      	'<div>' +
	      	'<p data-range="0-12">123 abc hello</p>' +
	      	'<p data-range="13-19">456 789</p>' +
      	'</div>' +
      	'<p data-range="20-23">blah</p>');
    });
  });
});

describe('Set Ranges', () => {

	var doc = '<p>dingles and</p>' +
		  		'<p>' +
		  			'fart' +
		  			'<strong>bird</strong>' +
		  			'cat' +
		  		'</p>';

  describe('simple', () => {
    it('should wrap in span and return correct ranges', () => {
      result = setRanges(doc);
      expect(result).to.equal(
      	'<p data-range="0-10">dingles and</p>' +
		  	'<p>' +
		  		'<span data-range="11-14">fart</span>' +
		  		'<strong data-range="15-18">bird</strong>' +
		  		'<span data-range="19-21">cat</span>' +
		  	'</p>'
		);
    });
  });
});
