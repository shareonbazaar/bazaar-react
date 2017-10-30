import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  happenedAt: Date,
  link: String,
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
