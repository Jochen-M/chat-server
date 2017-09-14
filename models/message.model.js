'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let MessageSchema = new Schema({
  f_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  t_user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  content: {
    type: String,
    required: false
  },
  type: {
    type: String,
    default: 'message'
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
