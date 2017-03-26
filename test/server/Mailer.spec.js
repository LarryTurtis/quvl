import { expect } from 'chai';
import { stub, spy } from 'sinon';
import Mailer from '../../src/server/Mailer';
import ses from '../../src/server/ses';

let mailer;
let sendSpy;

beforeEach(() => {
  stub(ses, 'sendEmail');
  mailer = new Mailer(ses);
  sendSpy = spy(mailer, 'send');
});

afterEach(() => {
  ses.sendEmail.restore();
  mailer.send.restore();
});

describe('Send Invite', () => {
  it('should call send', () => {
    mailer.sendInvite();
    expect(sendSpy.calledOnce).to.be.true;
  });
  it('should accept a `to` param', () => {
    const to = 'abc';
    mailer.sendInvite(to);
    const args = sendSpy.args[0][0];
    expect(args.to).to.equal(to);
  });
  it('should have a title', () => {
    mailer.sendInvite();
    const args = sendSpy.args[0][0];
    expect(args.title).to.equal('Invitation To ServerBid');
  });
  it('should have a from address', () => {
    mailer.sendInvite();
    const args = sendSpy.args[0][0];
    expect(args.from).to.equal('gkertis@serverbid.com');
  });
  it('should accept a `channelId` param', () => {
    const channelId = 123;
    mailer.sendInvite(null, channelId);
    const args = sendSpy.args[0][0];
    expect(args.message).to.contain(channelId);
  });
  it('should accept a `callback` param', () => {
    const callback = function test() { };
    mailer.sendInvite(null, null, callback);
    const callbackArg = sendSpy.args[0][1];
    expect(callbackArg).to.equal(callback);
  });
});
