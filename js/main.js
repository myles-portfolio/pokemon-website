const cardsContainer = document.querySelector('.grid-container');

const getPokemon = () => {
  const limit = 30;
  const offset = (currentPage - 1) * limit;
  return fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
    .then(response => response.json())
    .then(data => data.results);
}

const createPokemonCard = pokemonData => {
  let cardDetails = `
    Height: ${pokemonData.height}
    Weight: ${pokemonData.weight}
    Base Experience: ${pokemonData.base_experience}
    HP: ${pokemonData.stats[0].base_stat}
    Attack: ${pokemonData.stats[1].base_stat}
    Defense: ${pokemonData.stats[2].base_stat}
  `;
  
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
  card.setAttribute('data-id', pokemonData.id);
  cardBottom.appendChild(id);

  const type = document.createElement('div');
  type.className = `type ${pokemonData.types[0].type.name}`;
  type.textContent = pokemonData.types[0].type.name.charAt(0).toUpperCase() + pokemonData.types[0].type.name.slice(1);
  cardBottom.appendChild(type);

  card.appendChild(cardBottom);
  return card;
}

const addCards = async (pokemon) => {
  try {
    // Create an array of promises for each API call
    const pokemonPromises = pokemon.map(p => {
      return fetch(p.url)
        .then(response => response.json())
    });

    // Wait for all the promises to finish before creating the cards
    const pokemonDataArr = await Promise.all(pokemonPromises);
    pokemonDataArr.forEach(pokemonData => {
      const card = createPokemonCard(pokemonData);
      cardsContainer.appendChild(card);
    });
  } catch (error) {
    console.log(error);
  }
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

// *** FILTER BUTTONS

const filters = document.querySelector('.filters-container');

if (filters) {
  const ascButton = document.getElementById('asc');
  const descButton = document.getElementById('desc');
  const resetButton = document.getElementById('reset');
  const buttonArray = [[ascButton, 'asc'],[descButton, 'desc']];
  buttonArray.forEach((button) => {
    button[0].addEventListener('click', () => {
      sortCardsByName(button[1]);
    });
  });
  
  resetButton.addEventListener('click', () => {
    const cards = Array.from(cardsContainer.children);
    cards.sort(({ dataset: { id: aId } }, { dataset: { id: bId } }) => parseInt(aId) - parseInt(bId));
    cardsContainer.innerHTML = '';
    cards.forEach(card => cardsContainer.appendChild(card));
  });
}

const sortCardsByName = sortOrder => {
  const cards = Array.from(cardsContainer.children);
  const compareNames = (card1, card2) => {
    const names = [
      card1.querySelector('.name').textContent,
      card2.querySelector('.name').textContent,
    ];
    return sortOrder === 'asc' ? names[0].localeCompare(names[1]) : names[1].localeCompare(names[0]);
  };
  cards.sort(compareNames);
  cardsContainer.innerHTML = '';
  cards.forEach(card => cardsContainer.appendChild(card));
}

// *** TOTAL STATS

const calculateTotalStats = pokemonDataArray => {
  const hpElement = document.getElementById('hp');
  const atkElement = document.getElementById('atk');
  const defElement = document.getElementById('def');

  let totalHp = 0;
  let totalAtk = 0;
  let totalDef = 0;

  pokemonDataArray.forEach(pokemonData => {
    const [hp, atk, def] = ['hp', 'attack', 'defense'].map((statVal) => {
      return pokemonData.stats.find(stat => stat.stat.name === statVal).base_stat;
    })

    totalHp += hp;
    totalAtk += atk;
    totalDef += def;
  });

  hpElement.textContent = totalHp;
  atkElement.textContent = totalAtk;
  defElement.textContent = totalDef;
}

// *** Nav Menu

  const navButton = document.querySelector('button[aria-expanded]');

  function toggleNav({ target }) {
    const expanded = target.getAttribute('aria-expanded') === 'true' || false;
    navButton.setAttribute('aria-expanded', !expanded);
  }

  navButton.addEventListener('click', toggleNav);