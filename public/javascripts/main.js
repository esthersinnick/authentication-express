'use strict';

const main = () => {
  const form = document.querySelector('.recipe-create');
  const listRecipes = document.querySelector('.recipe-list');

  const addEventsToDelete = () => {
    const deleteButtons = document.querySelectorAll('article button');

    // delete recipe
    deleteButtons.forEach((button) => {
      button.addEventListener('click', async (event) => {
      // request axios post delete (de la db)
        const id = event.target.id;
        await axios.post(`/api/recipes/${id}/delete`);
        // delete article de la recipe
        const article = event.target.parentElement; // hace referencia al article que engloba el button
        article.remove();
      });
    });
  };

  addEventsToDelete();

  // Add recipe
  form.addEventListener('submit', async (event) => {
    event.preventDefault();// elimina el comportamiento default del element, en este caso el submit del form (hacer refresh)
    const recipe = {
      title: event.srcElement.title.value,
      duration: event.srcElement.duration.value,
      cuisine: event.srcElement.cuisine.value,
      level: event.srcElement.level.value
    };
    const response = await axios.post('/api/recipes', recipe); // (ruta , info a enviar) recipe es el body del req de api.js
    form.reset();
    console.log(response);
    const newRecipe = response.data;
    const article = document.createElement('article');
    const button = document.createElement('button');
    button.setAttribute('id', newRecipe._id);
    button.innerText = 'Delete';
    const p = document.createElement('p');
    p.innerText = `${newRecipe.title} - ${newRecipe.level}`;

    article.appendChild(p);
    article.appendChild(button);
    listRecipes.appendChild(article);
    addEventsToDelete();
  });
};

window.addEventListener('load', main);
