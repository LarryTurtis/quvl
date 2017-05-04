const LINK = 'https://quvl.io/';

class Mailer {
  constructor(ses) {
    this.ses = ses;
  }

  sendInvite(to, inviter) {
    // TODO: Replace with verified production email address.
    const options = {
      to,
      from: 'garykertis@gmail.com',
      title: 'Invitation To Quvl',
      // TODO: Replace with proper formatted HTML doc & link.
      message: `<p>You have been invited by ${inviter} to join a writing group on ` +
      `<a href="${LINK}">QUVL.</a></p>`
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
