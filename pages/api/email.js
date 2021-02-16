//const sgMail = require('@sendgrid/mail')
//sgMail.setApiKey(process.env.SENDGRID_API_KEY)
//sgMail.setApiKey('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')

//module.exports = (req, res) => {
  //const { name = 'World' } = req.query



 // res.status(200).send(`Hello ${name}!`)
//}

import sendgrid from '@sendgrid/mail';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

//to: ['alain@cornerstonewallsolutions.com', 'dave@cornerstonewallsolutions.com'],

export default async (req, res) => {
  try {
    await sendgrid.send({
      to: ['dermot@clarasolutions.com'],
      bcc: 'tomredf@gmail.com',
      from: 'dermot@claraprojects.com',
      subject: 'New MagnumStone Wall Calculator Signup',
      text: 'New user has signed up for MagnumStone Calculator. : ' + req.body.name + ' - ' + req.body.email + ' - ' + req.body.city + ' - ' + req.body.state 
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ res: 'Email sent -' });
};