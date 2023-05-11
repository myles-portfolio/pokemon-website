const favoritesData = JSON.parse(localStorage.getItem('favorites'));
const noFavsElement = document.getElementById('no-favs');

while (cardsContainer.firstChild) {
  cardsContainer.removeChild(cardsContainer.firstChild);
}

function updateNoFavsElementVisibility() {
  const favoritesData = JSON.parse(localStorage.getItem('favorites'));
  
  if (favoritesData.length === 0) {
    noFavsElement.style.visibility = 'visible';
  } else {
    noFavsElement.style.visibility = 'hidden';
  }
}

updateNoFavsElementVisibility();

let pokemonDataArray = [];

Promise.all(favoritesData.map(pokemonId => {
  return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
    .then(response => response.json())
})).then(pokemonData => {
  pokemonDataArray = pokemonData;
  cardsContainer.innerHTML = '';

  pokemonData.forEach(pokemonData => {
    const card = createPokemonCard(pokemonData);
    addUnfavoriteButtonToTooltip(card.querySelector('.card-top'), pokemonData);
    cardsContainer.appendChild(card);
  });

  calculateTotalStats(pokemonDataArray);
}).catch(error => console.log(error));

function addUnfavoriteButtonToTooltip(cardTop, pokemonData) {
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

  const unfavoriteButton = document.createElement('button');
  unfavoriteButton.textContent = 'Unfavorite';
  unfavoriteButton.className = 'favorite-btn';

  unfavoriteButton.addEventListener('click', () => {
    cardTop.parentNode.parentNode.removeChild(cardTop.parentNode);

    const favoritesData = JSON.parse(localStorage.getItem('favorites'));
    const index = favoritesData.indexOf(pokemonData.id);
    if (index > -1) {
      favoritesData.splice(index, 1);
      localStorage.setItem('favorites', JSON.stringify(favoritesData));
      updateNoFavsElementVisibility();
      
      // fetch updated data for the remaining favorites and push it to pokemonDataArray
      Promise.all(favoritesData.map(pokemonId => {
        return fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`)
          .then(response => response.json())
      })).then(updatedPokemonData => {
        pokemonDataArray = updatedPokemonData;
        cardsContainer.innerHTML = '';

        updatedPokemonData.forEach(updatedPokemonData => {
          const card = createPokemonCard(updatedPokemonData);
          addUnfavoriteButtonToTooltip(card.querySelector('.card-top'), updatedPokemonData);
          cardsContainer.appendChild(card);
        });

        calculateTotalStats(pokemonDataArray);
      }).catch(error => console.log(error));
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
