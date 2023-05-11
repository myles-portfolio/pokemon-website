const cardsContainer = document.querySelector('.grid-container');

function getPokemon() {
  const limit = 30;
  const offset = (currentPage - 1) * limit;
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(data => data.results);
}

function createPokemonCard(pokemonData) {
  let cardDetails = `Height: ${pokemonData.height}\nWeight: ${pokemonData.weight}\nBase Experience: ${pokemonData.base_experience}\nHP: ${pokemonData.stats[0].base_stat}\nAttack: ${pokemonData.stats[1].base_stat}\nDefense: ${pokemonData.stats[2].base_stat}`;
  
  const card = document.createElement('div');
  card.className = 'card';

  const cardTop = document.createElement('div');
  cardTop.className = 'card-top';

  const imgWrapper = document.createElement('div');
  imgWrapper.className = 'img-wrapper';
  const img = document.createElement('img');
  img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;
  img.alt = pokemonData.name;
  imgWrapper.appendChild(img);
  cardTop.appendChild(imgWrapper);

  card.appendChild(cardTop);

  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip';

  const tooltipText = document.createElement('div');
  tooltipText.className = 'tooltip-text'
  tooltipText.textContent = cardDetails;
  tooltip.appendChild(tooltipText);

  const favoriteButton = document.createElement('button');
  favoriteButton.textContent = 'Favorite';
  favoriteButton.className = 'favorite-btn';

  cardTop.addEventListener('mouseenter', () => {
    cardTop.appendChild(tooltip);
  });

  cardTop.addEventListener('mouseleave', () => {
    const tooltip = cardTop.querySelector('.tooltip');
    if (tooltip) {
      cardTop.removeChild(tooltip);
    }
  });     

  const cardBottom = document.createElement('div');
  cardBottom.className = 'card-bottom';

  const name = document.createElement('h3');
  name.className = 'name';
  name.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
  cardBottom.appendChild(name);

  const id = document.createElement('p');
  id.className = 'id';
  id.textContent = `#${pokemonData.id}`;
  cardBottom.appendChild(id);

  const type = document.createElement('div');
  type.className = `type ${pokemonData.types[0].type.name}`;
  type.textContent = pokemonData.types[0].type.name.charAt(0).toUpperCase() + pokemonData.types[0].type.name.slice(1);
  cardBottom.appendChild(type);

  card.appendChild(cardBottom);
  return card;
}

function addCards(pokemon) {
  // Create an array of promises for each API call
  const pokemonPromises = pokemon.map(p => {
    return fetch(p.url)
      .then(response => response.json())
  });

  // Wait for all the promises to finish before creating the cards
  Promise.all(pokemonPromises).then(pokemonDataArr => {
    pokemonDataArr.forEach(pokemonData => {
      const card = createPokemonCard(pokemonData);
      cardsContainer.appendChild(card);
    })
  })
.catch(error => console.log(error));
}

const pagination = document.querySelector('.pagination');
let prevBtn, nextBtn;
let currentPage = 1;
let offset = 0;

if (pagination) {
  prevBtn = pagination.querySelector('.previous');
  nextBtn = pagination.querySelector('.next');

  prevBtn.addEventListener('click', () => {
    if (offset > 0) {
      offset -= 30;
      currentPage--;
      loadCards();
    }
  });

  nextBtn.addEventListener('click', () => {
    offset += 30;
    currentPage++;
    loadCards();
  });
}

function loadCards() {
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
  
  getPokemon().then(pokemon => {
  addCards(pokemon);
});

function updatePageNumber() {
  const pageNumber = document.querySelector('.current-page');
  if (pageNumber) {
    pageNumber.textContent = currentPage;
  }
}

updatePageNumber();
}

loadCards();