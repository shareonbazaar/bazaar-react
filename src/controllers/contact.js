import nodemailer from 'nodemailer';
import fs from 'fs-extra';
import mustache from 'mustache';
import moment from 'moment';

import Skill from '../models/Skill';

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
  transporter.sendMail({
    to: process.env.CONTACT_EMAIL,
    from: `${req.body.name} <${req.body.email}>`,
    subject: 'Contact Form | Bazaar',
    text: req.body.message
  })
    .then(() => res.json({ error: null }))
    .catch(err => res.json({ error: err.message }));
};

exports.sendWelcomeEmail = (recipient, baseUrl) =>
  fs.readFile('emailTemplates/welcome.html', 'utf8')
    .then(template => mustache.render(template, {
      recipient,
      baseUrl,
    }))
    .then(html => transporter.sendMail({
      to: recipient.email,
      from: 'Bazaar Team <team@shareonbazaar.eu>',
      subject: `Welcome to the Bazaar, ${recipient.profile.name}`,
      html,
      text: `Hi ${recipient.profile.name},\n\n Thanks for signing up to Bazaar!.\n`,
    }));


exports.sendMessageEmail = (sender, recipient, message, baseUrl) =>
  fs.readFile('emailTemplates/newMessage.html', 'utf8')
    .then(template => mustache.render(template, {
      recipientName: recipient.profile.name.split(' ')[0],
      senderName: sender.profile.name.split(' ')[0],
      senderPicture: sender.profile.picture,
      message,
      baseUrl,
    }))
    .then(html => transporter.sendMail({
      to: recipient.email,
      from: 'Bazaar Team <team@shareonbazaar.eu>',
      subject: `New message from ${sender.profile.name}`,
      html,
      text: `Hi ${recipient.profile.name},\n\n` +
          `You have a new message from ${sender.profile.name}! Please log on to Bazaar to read it.\n`,
    }));


exports.sendUpdateEmail = (sender, recipient, transaction, baseUrl) =>
  fs.readFile('emailTemplates/updateSchedule.html', 'utf8')
    .then(template => mustache.render(template, {
      recipientName: recipient.profile.name.split(' ')[0],
      senderName: sender.profile.name.split(' ')[0],
      timestamp: moment(transaction.happenedAt).format('llll'),
      lng: transaction.loc.coordinates[0],
      lat: transaction.loc.coordinates[1],
      placeName: transaction.placeName,
      baseUrl,
    }))
    .then(html => transporter.sendMail({
      to: recipient.email,
      from: 'Bazaar Team <team@shareonbazaar.eu>',
      subject: `Update on your exchange with ${sender.profile.name}`,
      html,
      text: `Hi ${recipient.profile.name},\n\n
      Your exchange with ${sender.profile.name} has been updated! Please log on to Bazaar to review it.\n`,
    }));


exports.sendNewTransactionEmail = (sender, recipient, transaction, baseUrl) =>
  Promise.all([
    Skill.findOne({ _id: transaction.service }),
    fs.readFile('emailTemplates/newTransaction.html', 'utf8'),
  ])
    .then(([skill, template]) => mustache.render(template, {
      recipientName: recipient.profile.name.split(' ')[0],
      senderName: sender.profile.name.split(' ')[0],
      baseUrl,
      skill: skill.label.en,
    }))
    .then(html => transporter.sendMail({
      to: recipient.email,
      from: 'Bazaar Team <team@shareonbazaar.eu>',
      subject: `${sender.profile.name} would like to do an exchange with you!`,
      html,
      text: `Hi ${recipient.profile.name},\n\n
          ${sender.profile.name} has requested a skill exchange with you! Please log on to Bazaar to see it.\n`,
    }));

exports.forgotPasswordEmail = (user, baseUrl) =>
  transporter.sendMail({
    to: user.email,
    from: 'Bazaar Team <team@shareonbazaar.eu>',
    subject: 'Reset your password on Bazaar',
    text: `You are receiving this email because you (or someone else)
        have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${baseUrl}/reset/${user.passwordResetToken}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
  });
