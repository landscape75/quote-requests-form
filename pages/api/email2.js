import sendgrid from "@sendgrid/mail";
//
sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

const email = async (req, res) => {
  try {
    await sendgrid.send({
      from: "quotes@landscapecentre.com",
      to: ["quotes@landscapecentre.com"],
      replyTo: req.body.email,
      subject: "New Quote Request From " + req.body.name,
      text: "" + req.body.name + " has submitted a Quote Request. ",
      html:
        req.body.name +
        " has submitted a Quote Request. <br><br>" +
        //'Please see information submitted below. All quote requests should be managed in the <a href="https://quote-requests-admin.vercel.app">Quote Admin App.</a><br><br>' +
        req.body.data,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ res: "Email 2 sent -" });
};

export default email;
