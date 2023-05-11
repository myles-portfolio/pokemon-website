var favoriteData = [];

const updateFavorites = (pokemonId) => {
  favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];

  if (!favoriteData.includes(pokemonId)) {
    favoriteData.push(pokemonId);
    localStorage.setItem('favorites', JSON.stringify(favoriteData));
  }
}

const loadCards = (pokemonDataArray) => {
  cardsContainer.innerHTML = '';
  pokemonDataArray.forEach(pokemonData => {
    if (!favoriteData.includes(pokemonData.id)) {
      const card = createPokemonCard(pokemonData);
      addFavoriteButtonToTooltip(card.querySelector('.card-top'), pokemonData, pokemonDataArray);
      cardsContainer.appendChild(card);
    }
  });
}

const retrieveRemainingCards = (pokemonDataArray) => {
  favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
  const remainingCards = pokemonDataArray.filter(pokemonData => !favoriteData.includes(pokemonData.id));
  return remainingCards;
}

fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
  .then(response => response.json())
  .then(data => {
    const promises = data.results.map(pokemon => fetch(pokemon.url).then(response => response.json()));
    return Promise.all(promises);
  })
  .then(pokemonDataArray => {
    favoriteData = JSON.parse(localStorage.getItem('favorites')) || [];
    loadCards(pokemonDataArray);
    const remainingCards = retrieveRemainingCards(pokemonDataArray);
    calculateTotalStats(remainingCards);
  })
  .catch(error => console.log(error));

const addFavoriteButtonToTooltip = (cardTop, pokemonData, pokemonDataArray) => {
  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text';
  tooltipText.textContent = `
    Height: ${pokemonData.height}
    Weight: ${pokemonData.weight}
    Base Experience: ${pokemonData.base_experience}
    HP: ${pokemonData.stats[0].base_stat}
    Attack: ${pokemonData.stats[1].base_stat}
    Defense: ${pokemonData.stats[2].base_stat}
  `;

  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = 'Favorite';
  favoriteButton.className = 'favorite-btn';

  favoriteButton.addEventListener('click', () => {
    updateFavorites(pokemonData.id);
    cardTop.parentNode.parentNode.removeChild(cardTop.parentNode);
    
    const remainingCards = retrieveRemainingCards(pokemonDataArray);
    console.log(remainingCards);
    calculateTotalStats(remainingCards);
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