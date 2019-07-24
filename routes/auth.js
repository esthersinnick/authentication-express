'use strict';

const express = require('express');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const { isLoggedIn, isNotLoggedIn, isFormFilled } = require('../middlewares/authMiddlewares');

const saltRounds = 10;
const router = express.Router();

/* GET home page. */
router.get('/signup', isLoggedIn, (req, res, next) => { // renderiza el formulario de sign up
  const data = {
    messages: req.flash('errorFormNotFilled'), // req.flash siempre devuelve un array, aunque solo haya un mensaje.
    username: req.flash('usernameRecover')
  };
  res.render('signup', data);
});

router.post('/signup', isLoggedIn, isFormFilled, async (req, res, next) => { // hace la acción del botón de signup
  try {
    const { username, password } = req.body; // desestructuración de objetos
    /* encriptar password */
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt); // aquí le passamos password

    /* comprobamos que el usuario sea único */
    const user = await User.findOne({ username });
    if (user) {
      return res.redirect('/auth/signup');
    }
    /* */

    const newUser = await User.create({ // el método create es propio de los modelos de mongoose
      username,
      password: hashedPassword
    });
    req.session.currentUser = newUser; // guardamos el nuevo usuario como el usuario de esa sesión. CurrentUser no es una palabra clave, es una propiedad que creamos dentro del objeto session
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

router.get('/login', isLoggedIn, (req, res, next) => { // renderiza el formulario de login
  res.render('login');
});

router.post('/login', isLoggedIn, isFormFilled, async (req, res, next) => { // hace la acción del botón de login
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username }); // username porque es unique, si no lo fuera, deberíamos usar el mail o algo similar,
    if (!user) { // validamos si encuentra el usuario apra continuar
      return res.redirect('/auth/login');
    }
    /* comprobación de password a través de bcrypt */
    if (bcrypt.compareSync(password, user.password)) {
      req.session.currentUser = user;
      res.redirect('/');
    } else {
      res.redirect('/auth/login');
    }
    /* */
  } catch (error) {
    next(error);
  }
});

router.post('/logout', isNotLoggedIn, (req, res, next) => { // hace la acción del botón de logOut
  delete req.session.currentUser; // delete elimina una key de un objeto
  res.redirect('/auth/login');
});

module.exports = router;
