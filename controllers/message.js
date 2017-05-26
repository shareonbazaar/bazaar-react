const socketioJwt   = require("socketio-jwt");
const nodemailer = require('nodemailer');

const User = require('../models/User');
const Message = require('../models/Message');
const Transaction = require('../models/Transaction');
const contact = require('./contact');

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
        .then(user => {
            // FIXME: Will this work if we have multiple servers??
            // Cuz I'm keeping this map in memory. Does it need to be in DB?
            if (!user) {
                console.log(`Unknown user ${socket.decoded_token.email} is trying to connect`);
                return;
            }

            socket_map[user._id] = socket.id;
            socket.on('send message', function (data) {
                addMessageToTransaction(user, data.message, data.t_id, socket.request.headers.host);
            });
        })
    });

    io.sockets.on('disconnect', function (socket) {
      User.find({email: socket.decoded_token.email}).exec()
        .then(user => {
            delete socket_map[user._id];
        })
    });
}

function addMessageToTransaction (sender, messageText, transactionId, baseUrl) {
    var newMsg = new Message({
        message: messageText,
        _transaction: transactionId,
        _sender: sender._id,
    });
    return newMsg.save()
    .then(message => {
      return Transaction.findOne({_id: message._transaction})
      .populate('_participants')
      .exec();
    })
    .then(transaction => {

          return Promise.all(transaction._participants.map(user => {
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
                  if (!isMe && user.acceptsEmails.newMessages) {
                      return contact.sendMessageEmail(sender, user, messageText, baseUrl);
                  } else {
                      return {}
                  }
              })
          }))
    })
    .catch(err => console.log(err))
};

exports.addMessageToTransaction = addMessageToTransaction;

