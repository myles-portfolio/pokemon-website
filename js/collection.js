var favoriteData = [];

const updateFavorites = (pokemonId) => {
  favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favoriteData.includes(pokemonId)) {
    favoriteData.push(pokemonId);
    localStorage.setItem('favorites', JSON.stringify(favoriteData));
  }
}

fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
  .then(response => response.json())
  .then(data => {
    const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
    
    return Promise.all(promises);
  })
  .then(pokemonDataArray => {
    cardsContainer.innerHTML = '';
    pokemonDataArray.forEach(pokemonData => {
      const card = createPokemonCard(pokemonData);
      addFavoriteButtonToTooltip(card.querySelector('.card-top'), pokemonData);
      cardsContainer.appendChild(card);
    });
  })
  .catch(error => console.log(error));

function addFavoriteButtonToTooltip(cardTop, pokemonData) {
  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text';
  tooltipText.textContent = `Height: ${pokemonData.height}\nWeight: ${pokemonData.weight}\nBase Experience: ${pokemonData.base_experience}\nHP: ${pokemonData.stats[0].base_stat}\nAttack: ${pokemonData.stats[1].base_stat}\nDefense: ${pokemonData.stats[2].base_stat}`;

  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = 'Favorite';
  favoriteButton.className = 'favorite-btn';

  favoriteButton.addEventListener('click', () => {
    updateFavorites(pokemonData.id);
  });

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.appendChild(tooltipText);
  tooltip.appendChild(favoriteButton);

  cardTop.addEventListener('mouseenter', () => {
    cardTop.appendChild(tooltip);
  });

  cardTop.addEventListener('mouseleave', () => {
    cardTop.removeChild(tooltip);
  });
}
