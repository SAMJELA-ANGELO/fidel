const mailjet = require('node-mailjet');

const mailjetClient = mailjet.apiConnect(
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE
);

async function sendEmail({ to, subject, html, from }) {
  try {
    const result = await mailjetClient.post('send', { version: 'v3.1' }).request({
      Messages: [
        {
          From: {
            Email: from,
            Name: 'Fidels',
          },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    });
    return result.body;
  } catch (err) {
    throw err;
  }
}

module.exports = { sendEmail };
