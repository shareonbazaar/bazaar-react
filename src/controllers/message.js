import socketioJwt from 'socketio-jwt';
import socketio from 'socket.io';

import User from '../models/User';
import Message from '../models/Message';
import Transaction from '../models/Transaction';
import contact from './contact';

let io;
let socket_map;

function addMessageToTransaction(sender, messageText, transactionId, baseUrl) {
  const newMsg = new Message({
    message: messageText,
    _transaction: transactionId,
    _sender: sender._id,
  });
  return newMsg.save()
    .then(message =>
      Transaction.findOne({ _id: message._transaction })
        .populate('_participants')
        .exec()
    )
    .then(transaction =>
      Promise.all(transaction._participants.map((t_user) => {
        const isMe = (sender._id.toString() === t_user._id.toString());
        if (t_user.unreadTransactions.indexOf(transaction.id) < 0) {
          t_user.unreadTransactions.push(transaction.id);
        }
        return t_user.save()
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
            if (!isMe && t_user.acceptsEmails.newMessages) {
              return contact.sendMessageEmail(sender, t_user, messageText, baseUrl);
            }
            return {};
          });
      }))
    )
    .catch(err => console.log(err));
}

exports.addMessageToTransaction = addMessageToTransaction;


exports.initSockets = (server) => {
  io = socketio(server);

  // With Socket.io >= 1.0
  io.use(socketioJwt.authorize({
    secret: process.env.SESSION_SECRET,
    handshake: true,
  }));

  socket_map = {};

  io.sockets.on('connection', (socket) => {
    User.findOne({ email: socket.decoded_token.email }).exec()
      .then((user) => {
        // FIXME: Will this work if we have multiple servers??
        // Cuz I'm keeping this map in memory. Does it need to be in DB?
        if (!user) {
          console.log(`Unknown user ${socket.decoded_token.email} is trying to connect`);
          return;
        }

        socket_map[user._id] = socket.id;
        socket.on('send message', (data) => {
          addMessageToTransaction(user, data.message, data.t_id, socket.request.headers.host);
        });
      });
  });

  io.sockets.on('disconnect', (socket) => {
    User.find({ email: socket.decoded_token.email }).exec()
      .then(user => delete socket_map[user._id]);
  });
};
