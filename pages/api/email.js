//const sgMail = require('@sendgrid/mail')
//sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//sgMail.setApiKey('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')

//module.exports = (req, res) => {
  //const { name = 'World' } = req.query



 // res.status(200).send(`Hello ${name}!`)
//}

import sendgrid from '@sendgrid/mail';
//
//sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
sendgrid.setApiKey('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');

export default async (req, res) => {
  try {
    await sendgrid.send({
      to: ['dermot@clandscapecentre.com'],
      bcc: 'tomredf@gmail.com',
      from: 'sales@landscapecentre.com',
      subject: 'New Cash Account Application',
      text: 'New contractor has applied for a cash account. : ' + req.body.name
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ res: 'Email sent -' });
};