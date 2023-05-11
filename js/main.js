const cardsContainer = document.querySelector('.grid-container');

// Modify the PokeAPI request URL to include the "limit" and "offset" parameters based on the current page
function getPokemon() {
  const limit = 30;
  const offset = (currentPage - 1) * limit;
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(data => data.results);
}

// Create the card elements and append them to the cards container
function createCards(pokemon) {
  // Create an array of promises for each API call
  const pokemonPromises = pokemon.map(p => {
    return fetch(p.url)
      .then(response => response.json())
  });

  // Wait for all the promises to finish before creating the cards
  Promise.all(pokemonPromises).then(pokemonDataArr => {
    pokemonDataArr.forEach(pokemonData => {
      // Create the card element and set its attributes
      const card = document.createElement('div');
      card.className = 'card';

      // Create the card top element and set its attributes
      const cardTop = document.createElement('div');
      cardTop.className = 'card-top';

      // Create the image element and set its attributes
      const imgWrapper = document.createElement('div');
      imgWrapper.className = 'img-wrapper';
      const img = document.createElement('img');
      img.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;
      img.alt = pokemonData.name;
      imgWrapper.appendChild(img);
      cardTop.appendChild(imgWrapper);

      // Add the card top element to the card
      card.appendChild(cardTop);

      // Add the tooltip event listener
      cardTop.addEventListener('mouseenter', () => {
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';

        // Create tooltip text
        const tooltipText = document.createElement('div');
        tooltipText.className = 'tooltip-text'
        tooltipText.textContent = `Height: ${pokemonData.height}\nWeight: ${pokemonData.weight}\nBase Experience: ${pokemonData.base_experience}\nHP: ${pokemonData.stats[0].base_stat}\nAttack: ${pokemonData.stats[1].base_stat}\nDefense: ${pokemonData.stats[2].base_stat}`;
        tooltip.appendChild(tooltipText);

        cardTop.appendChild(tooltip);
      });

      cardTop.addEventListener('mouseleave', () => {
        const tooltip = cardTop.querySelector('.tooltip');
        if (tooltip) {
          cardTop.removeChild(tooltip);
        }
      });      

      // Create the card bottom element and set its attributes
      const cardBottom = document.createElement('div');
      cardBottom.className = 'card-bottom';

      // Create the name element and set its text content with the first character of the name capitalized
      const name = document.createElement('h3');
      name.className = 'name';
      name.textContent = pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1);
      cardBottom.appendChild(name);

      // Create the ID element and set its text content
      const id = document.createElement('p');
      id.className = 'id';
      id.textContent = `#${pokemonData.id}`;
      cardBottom.appendChild(id);

      // Create the type element and set its attributes and text content
      const type = document.createElement('div');
      type.className = `type ${pokemonData.types[0].type.name}`;
      type.textContent = pokemonData.types[0].type.name.charAt(0).toUpperCase() + pokemonData.types[0].type.name.slice(1);
      cardBottom.appendChild(type);

      // Add the card bottom element to the card
      card.appendChild(cardBottom);
      // Add the completed card to the cards container
      cardsContainer.appendChild(card);
    })
  })
.catch(error => console.log(error));
}

// Add pagination
const pagination = document.querySelector('.pagination');
const prevBtn = pagination.querySelector('.previous');
const nextBtn = pagination.querySelector('.next');
let currentPage = 1;
let offset = 0;

// Add event listeners to the previous and next buttons
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

function loadCards() {
  // Remove any existing cards from the container
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
  
  // Make a GET request to the PokeAPI with the current offset
  getPokemon().then(pokemon => {
  createCards(pokemon);
});

// Update the current page number
function updatePageNumber() {
  const pageNumber = document.querySelector('.current-page');
  if (pageNumber) {
    pageNumber.textContent = currentPage;
  }
}

// Initialize the page number
updatePageNumber();
}

loadCards();