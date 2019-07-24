'use strict';

const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');

router.post('/recipes', async (req, res, next) => {
  const { title, level, cuisine, duration } = req.body;
  try {
    const recipe = await Recipe.create({ title, level, cuisine, duration });
    const recipeId = recipe._id; // guardamos la id de la receta que acabamos de crear
    const userId = req.session.currentUser._id; // buscamos el usuario logueado
    await User.findByIdAndUpdate(userId, { $push: { recipes: recipeId } }); // buscamos en el usuario el array de recetas y le hacemos push del id de la nueva receta
    res.json(recipe); // pasamos la receta nueva para que la añada a la página privada personal
  } catch (error) {
    next(error);
  }
});

router.post('/recipes/:id/delete', async (req, res, next) => {
  const { id } = req.params;
  await Recipe.findByIdAndDelete(id);
  res.json({ response: 'Ok' }); // respondemos para acabar la request, porque tiene que tener una respuesta. Este mensaje no se imprime en ningún sitio.
});

module.exports = router;
