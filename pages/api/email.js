import sendgrid from "@sendgrid/mail";
//


const email = async (req, res) => {
  try {
    await sendgrid.send({
      to: [req.body.email],
      from: 'quotes@landscapecentre.com',
      replyTo: 'quotes@landscapecentre.com',
      subject: 'Landscape Centre Quote Request',
      text: 'Hi ' + req.body.name + ',/n/nThank you for submitting your quote request. ' + 
      'If you have any questions, please call 604-540-0333. We will get back to you within 48 hours. We will email you if we require more information.',
      html: 'Hi ' + req.body.name + ',<br><br>Thank you for submitting your quote request. ' + 
      'If you have any questions, please call 604-540-0333. We will get back to you within 48 hours. We will email you if we require more information.<br><br>' + 
      'We have included a copy of the information you submitted below.<br><br>' +
      req.body.data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ res: "Email sent -" });
};

export default email;
