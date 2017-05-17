const socketioJwt   = require("socketio-jwt");
const nodemailer = require('nodemailer');

const User = require('../models/User');
const Message = require('../models/Message');
const Transaction = require('../models/Transaction');

var io;
var socket_map;

exports.initSockets = (server) => {
    io = require('socket.io')(server);

    //With Socket.io >= 1.0
    io.use(socketioJwt.authorize({
        secret: process.env.SESSION_SECRET,
        handshake: true,
    }));

    socket_map = {};

    io.sockets.on('connection', function (socket) {
        User.findOne({email: socket.decoded_token.email}).exec()
        .then((user) => {
            // FIXME: Will this work if we have multiple servers??
            // Cuz I'm keeping this map in memory. Does it need to be in DB?
            socket_map[user._id] = socket.id;
            socket.on('send message', function (data) {
                addMessageToTransaction(user, data.message, data.t_id);
            });
        })
    });

    io.sockets.on('disconnect', function (socket) {
      User.find({email: socket.decoded_token.email}).exec()
        .then((user) => {
            delete socket_map[user._id];
        })
    });
}

function addMessageToTransaction (sender, messageText, transactionId) {
    var newMsg = new Message({
        message: messageText,
        _transaction: transactionId,
        _sender: sender._id,
    });
    return newMsg.save()
    .then((message) => {
      return Transaction.findOne({_id: message._transaction})
      .populate('_participants')
      .exec();
    })
    .then((transaction) => {

          return Promise.all(transaction._participants.map((user) => {
              var isMe = (sender._id.toString() == user._id.toString());
              if (user.unreadTransactions.indexOf(transaction.id) < 0) {
                  user.unreadTransactions.push(transaction.id);
              }
              return user.save()
              .then((user) => {
                  if (socket_map[user._id]) {
                      io.to(socket_map[user._id]).emit('new message', {
                          author: sender.profile.name,
                          text: newMsg.message,
                          date: newMsg.createdAt,
                          sentByCurrUser: isMe,
                          t_id: transaction._id,
                      });
                  }
                  return {};              
              })
              .then(() => {
                  if (!isMe) {
                      return sendMessageEmail(sender, user, messageText);
                  } else {
                      return {}
                  }
              })
          }))
    })
    .catch(err => console.log(err))
};

exports.addMessageToTransaction = addMessageToTransaction;

function sendMessageEmail (sender, recipient, message) {
    var transporter = nodemailer.createTransport({
      service: 'Mailgun',
      auth: {
        user: process.env.MAILGUN_USER,
        pass: process.env.MAILGUN_PASSWORD,
      },
    });

    return transporter.sendMail({
        to: recipient.email,
        from: 'Bazaar Team <team@shareonbazaar.eu>',
        subject: 'New message from ' + sender.profile.name,
        html: 'New message html ' + message,
        text: 'Hi ' + recipient.profile.name + ',\n\n' +
          'You have a new message from ' + sender.profile.name + '! Please log on to Bazaar to read it.\n',
    });
}

