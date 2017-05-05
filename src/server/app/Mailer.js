import templates from './templates';

const LINK = 'https://quvl.io/signup';


class Mailer {
  constructor(ses) {
    this.ses = ses;
  }

  sendInvite(to, inviter, name) {
    // TODO: Replace with verified production email address.
    const options = {
      to,
      from: `${inviter} <no-reply@quvl.io>`,
      title: 'Invitation To Quvl',
      // TODO: Replace with proper formatted HTML doc & link.
      message: templates.newGroup(to, LINK, inviter, name)
    };
    return this.send(options);
  }

  send = (options) => new Promise((resolve, reject) => {
    this.ses.sendEmail({
      Source: options.from,
      Destination: { ToAddresses: [options.to] },
      Message: {
        Subject: {
          Data: options.title
        },
        Body: {
          Html: {
            Data: options.message
          }
        }
      }
    }, (err, data) => {
      if (err) {
        console.log(err)
        reject(err);
      }
      else {
        console.log(data);
        resolve(data);
      }
    });
  });
}

export default Mailer;
