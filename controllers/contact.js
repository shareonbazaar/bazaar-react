const nodemailer = require("nodemailer");
const fs = require("fs.promised");
const mustache = require('mustache');
const moment = require('moment');

const Skill = require('../models/Skill');

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

exports.sendWelcomeEmail = (recipient, baseUrl) => {
    return fs.readFile('emailTemplates/welcome.html', 'utf8')
    .then(template => mustache.render(template, {
        recipient: recipient,
        baseUrl: baseUrl,
    }))
    .then(html => transporter.sendMail({
        to: recipient.email,
        from: 'Bazaar Team <team@shareonbazaar.eu>',
        subject: `Welcome to the Bazaar, ${recipient.profile.name}`,
        html: html,
        text: `Hi ${recipient.profile.name},\n\n` +
          `Thanks for signing up to Bazaar!.\n`,
    }));
}


exports.sendMessageEmail = (sender, recipient, message, baseUrl) => {
    return fs.readFile('emailTemplates/newMessage.html', 'utf8')
    .then(template => mustache.render(template, {
        recipientName: recipient.profile.name.split(' ')[0],
        senderName: sender.profile.name.split(' ')[0],
        senderPicture: sender.profile.picture,
        message: message,
        baseUrl: baseUrl,
    }))
    .then(html => transporter.sendMail({
        to: recipient.email,
        from: 'Bazaar Team <team@shareonbazaar.eu>',
        subject: `New message from ${sender.profile.name}`,
        html: html,
        text: `Hi ${recipient.profile.name},\n\n` +
          `You have a new message from ${sender.profile.name}! Please log on to Bazaar to read it.\n`,
    }));
}

exports.sendUpdateEmail = (sender, recipient, transaction, baseUrl) => {
    return fs.readFile('emailTemplates/updateSchedule.html', 'utf8')
    .then(template => mustache.render(template, {
        recipientName: recipient.profile.name.split(' ')[0],
        senderName: sender.profile.name.split(' ')[0],
        timestamp: moment(transaction.happenedAt).format('llll'),
        lng: transaction.loc.coordinates[0],
        lat: transaction.loc.coordinates[1],
        placeName: transaction.placeName,
        baseUrl: baseUrl,
    }))
    .then(html => transporter.sendMail({
        to: recipient.email,
        from: 'Bazaar Team <team@shareonbazaar.eu>',
        subject: `Update on your exchange with ${sender.profile.name}`,
        html: html,
        text: `Hi ${recipient.profile.name},\n\n` +
          `Your exchange with ${sender.profile.name} has been updated! Please log on to Bazaar to review it.\n`,
    }));
}

exports.sendNewTransactionEmail = (sender, recipient, transaction, baseUrl) => {
    return Promise.all([
        Skill.findOne({_id: transaction.service}),
        fs.readFile('emailTemplates/newTransaction.html', 'utf8'),
    ])
    .then(([skill, template]) => mustache.render(template, {
        recipientName: recipient.profile.name.split(' ')[0],
        senderName: sender.profile.name.split(' ')[0],
        baseUrl: baseUrl,
        skill: skill.label.en,
    }))
    .then(html => transporter.sendMail({
        to: recipient.email,
        from: 'Bazaar Team <team@shareonbazaar.eu>',
        subject: `${sender.profile.name} would like to do an exchange with you!`,
        html: html,
        text: `Hi ${recipient.profile.name},\n\n` +
          `${sender.profile.name} has requested a skill exchange with you! Please log on to Bazaar to see it.\n`,
    }));
}

exports.forgotPasswordEmail = (user, baseUrl) => {
    return transporter.sendMail({
        to: user.email,
        from: 'Bazaar Team <team@shareonbazaar.eu>',
        subject: 'Reset your password on Bazaar',
        text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
            Please click on the following link, or paste this into your browser to complete the process:\n\n
            http://${baseUrl}/reset/${user.passwordResetToken}\n\n
            If you did not request this, please ignore this email and your password will remain unchanged.\n`
    });
}
