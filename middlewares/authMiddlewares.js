'use strict';

const isLoggedIn = (req, res, next) => {
  if (req.session.currentUser) { // si ese usuario entra aquí estando logeado, redirige a la home.
    return res.redirect('/'); // con return paramos la función y no hace el segundo res
  }
  next();
};

const isNotLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect('/');
  }
  next();
};

const isFormFilled = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    req.flash('errorFormNotFilled', 'All fields are required'); // creamos un mensaje de error para cuando falte rellenar un campo del form
    if (username) {
      req.flash('usernameRecover', username);
    }
    return res.redirect(req.originalUrl); // req.originalUrl hace referencia a la ruta desde la que se ha hecho la request. HAcemos que se mantenga en esa página, tanto si está en login como si está en signup
  }
  next();
};

module.exports = {
  isLoggedIn,
  isNotLoggedIn,
  isFormFilled
};
