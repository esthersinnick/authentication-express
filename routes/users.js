'use strict';

const express = require('express');
const router = express.Router();
const { isNotLoggedIn } = require('../middlewares/authMiddlewares');
const User = require('../models/User');

/* GET users listing. */
router.get('/private', isNotLoggedIn, async (req, res, next) => {
  const userId = req.session.currentUser._id;
  const user = await User.findById(userId).populate('recipes'); // el populate(recipes) mongoose va a ir a buscar las recetas que encajen con ls IDs y las va a colocar dentro del usuario durante este proceso, de forma temporal.
  console.log(user);
  res.render('private', user);
});

module.exports = router;
