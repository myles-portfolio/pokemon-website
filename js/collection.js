var favoriteData = [];

const updateFavorites = (pokemonId) => {
  favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favoriteData.includes(pokemonId)) {
    favoriteData.push(pokemonId);
    localStorage.setItem('favorites', JSON.stringify(favoriteData));
  }
}

// Make a GET request to the PokeAPI for the first 30 Pokemon
fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
  .then(response => response.json())
  .then(data => {
    // Make an array of promises to fetch each pokemon's data
    const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
    
    // Wait for all the promises to resolve using Promise.all()
    return Promise.all(promises);
  })
  .then(pokemonDataArray => {
    // Iterate through the pokemon data and create a card for each
    cardsContainer.innerHTML = '';
    pokemonDataArray.forEach(pokemonData => {
      const card = createPokemonCard(pokemonData);
      addFavoriteButtonToTooltip(card.querySelector('.card-top'), pokemonData);
      cardsContainer.appendChild(card);
    });
  })
  .catch(error => console.log(error));

function addFavoriteButtonToTooltip(cardTop, pokemonData) {
  // Create tooltip text
  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text';
  tooltipText.textContent = `Height: ${pokemonData.height}\nWeight: ${pokemonData.weight}\nBase Experience: ${pokemonData.base_experience}\nHP: ${pokemonData.stats[0].base_stat}\nAttack: ${pokemonData.stats[1].base_stat}\nDefense: ${pokemonData.stats[2].base_stat}`;

  // Create favorite button
  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = 'Favorite';
  favoriteButton.className = 'favorite-btn';

  // Add event listener to the favorite button
  favoriteButton.addEventListener('click', () => {
    updateFavorites(pokemonData.id);
  });

  // Add the tooltip and favorite button to the card top
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.appendChild(tooltipText);
  tooltip.appendChild(favoriteButton);

  // Add the tooltip event listeners
  cardTop.addEventListener('mouseenter', () => {
    cardTop.appendChild(tooltip);
  });

  cardTop.addEventListener('mouseleave', () => {
    cardTop.removeChild(tooltip);
  });
}
