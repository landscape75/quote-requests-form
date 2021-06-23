import sendgrid from "@sendgrid/mail";
//
//sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
sendgrid.setApiKey(
  "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"
);

const email = async (req, res) => {
  try {
    await sendgrid.send({
      to: ["dermot@landscapecentre.com"],
      bcc: "tomredf@gmail.com",
      from: "sales@landscapecentre.com",
      subject: "New Quote Request",
      text: "New quote request submitted by : " + req.body.name,
      html: '<strong>New quote request submitted by :</strong>' + req.body.name,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ res: "Email sent -" });
};

export default email;
