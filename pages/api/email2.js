import sendgrid from "@sendgrid/mail";
//
//sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
sendgrid.setApiKey(
  "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"
);

const email = async (req, res) => {
  try {
    await sendgrid.send({
      to: ["quotes@landscapecentre.com"],
      //bcc: ['dermot@landscapecentre.com'],
      from: "quotes@landscapecentre.com",
      replyTo: req.body.email,
      subject: "New Quote Request From " + req.body.name,
      text: "" + req.body.name + " has submitted a Quote Request. ",
      html:
        req.body.name +
        " has subbmitted a Quote Request. <br><br>" +
        'Please see information submitted below. All quote requests should be managed in the <a href="https://quote-requests-admin.vercel.app">Quote Admin App.</a><br><br>' +
        req.body.data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ res: "Email 2 sent -" });
};

export default email;
