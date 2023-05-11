const favoritesData = JSON.parse(localStorage.getItem('favorites'));

while (cardsContainer.firstChild) {
  cardsContainer.removeChild(cardsContainer.firstChild);
}

Promise.all(favoritesData.map(pokemonId => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
})).then(pokemonDataArr => {
  // Clear the cards container
  cardsContainer.innerHTML = '';

  // Create a card for each Pokemon and add it to the container
  pokemonDataArr.forEach(pokemonData => {
    const card = createPokemonCard(pokemonData);
    addUnfavoriteButtonToTooltip(card.querySelector('.card-top'), pokemonData);
    cardsContainer.appendChild(card);
  });
}).catch(error => console.log(error));

function addUnfavoriteButtonToTooltip(cardTop, pokemonData) {
  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text';
  tooltipText.textContent = `Height: ${pokemonData.height}\nWeight: ${pokemonData.weight}\nBase Experience: ${pokemonData.base_experience}\nHP: ${pokemonData.stats[0].base_stat}\nAttack: ${pokemonData.stats[1].base_stat}\nDefense: ${pokemonData.stats[2].base_stat}`;

  const unfavoriteButton = document.createElement('button');
  unfavoriteButton.textContent = 'Unfavorite';
  unfavoriteButton.className = 'favorite-btn';

  unfavoriteButton.addEventListener('click', () => {
    // Remove the card from the page
    cardTop.parentNode.parentNode.removeChild(cardTop.parentNode);

    const favoritesData = JSON.parse(localStorage.getItem('favorites'));
    const index = favoritesData.indexOf(pokemonData.id);
    if (index > -1) {
      favoritesData.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favoritesData));
    }
  });

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';
  tooltip.appendChild(tooltipText);
  tooltip.appendChild(unfavoriteButton);

  cardTop.addEventListener('mouseenter', () => {
    cardTop.appendChild(tooltip);
  });

  cardTop.addEventListener('mouseleave', () => {
    cardTop.removeChild(tooltip);
  });
}