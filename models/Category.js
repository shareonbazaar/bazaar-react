var mongoose = require('mongoose');
var Skill = require('../models/Skill');

var categorySchema = new mongoose.Schema({
  label: {
    en: { type: String, default: '' },
    de: { type: String, default: '' },
    ar: { type: String, default: '' },
  },
  _skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
