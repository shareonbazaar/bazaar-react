const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: 'Mailgun',
  auth: {
    user: process.env.MAILGUN_USER,
    pass: process.env.MAILGUN_PASSWORD, 
  }
});

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postContact = (req, res) => {
    req.assert('name', 'Name cannot be blank').notEmpty();
    req.assert('email', 'Email is not valid').isEmail();
    req.assert('message', 'Message cannot be blank').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        return res.status(400).json({
            error: errors.map(e => e.msg).join('/'),
            token: null,
            status: 400,
        });
    }

    transporter.sendMail({
        to: process.env.CONTACT_EMAIL,
        from: `${req.body.name} <${req.body.email}>`,
        subject: 'Contact Form | Bazaar',
        text: req.body.message
    })
    .then(v => res.json({error: null}))
    .catch(err => res.json({error: err}))
};