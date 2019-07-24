'use strict';

const express = require('express');
const User = require('../models/User');

const { isNotLoggedIn } = require('../middlewares/authMiddlewares.js');
const Recipe = require('../models/Recipe');

const router = express.Router();

router.get('/create', isNotLoggedIn, (req, res, next) => {
  res.render('recipes/create');
});

router.post('/create', isNotLoggedIn, async (req, res, next) => {
  const { title, level, cuisine, duration } = req.body;
  try {
    const recipe = await Recipe.create({ title, level, cuisine, duration });
    const recipeId = recipe._id; // guardamos la id de la receta que acabamos de crear
    const userId = req.session.currentUser._id; // buscamos el usuario logueado
    await User.findByIdAndUpdate(userId, { $push: { recipes: recipeId } }); // buscamos en el usuario el array de recetas y le hacemos push del id de la nueva receta
    res.redirect('/users/private');
  } catch (error) {
    next(error);
  }
});
module.exports = router;
