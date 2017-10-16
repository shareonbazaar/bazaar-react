const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  label: {
    en: { type: String, default: '' },
    de: { type: String, default: '' },
    ar: { type: String, default: '' },
  },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);
