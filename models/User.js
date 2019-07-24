'use strict';
/* creado a partir de la boilerplate: m2/mongoose-models/user-with-auto-timestamps.js */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  recipes: [{
    type: ObjectId,
    ref: 'Recipe'
  }]
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

module.exports = User;
