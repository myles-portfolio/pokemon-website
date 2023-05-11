// Retrieve the data from local storage
const cardsContainer = document.querySelector('.grid-container');
const favoritesData = JSON.parse(localStorage.getItem('favorites'));

// Loop through the favoriteData array and create the cards for each favorited pokemon
favoritesData.forEach(pokemonId => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
    .then(pokemonData => {
      const card = createPokemonCard(pokemonData);
      addFavoriteButtonToTooltip(card.querySelector('.card-top'), pokemonData);
      cardsContainer.appendChild(card);
    })
    .catch(error => console.log(error));
});