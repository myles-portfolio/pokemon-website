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

const createNewCollection = () => {
  // Create a new card element
  const newCard = document.createElement('div');
  newCard.classList.add('collection-card');
  newCard.textContent = `Collection ${num}`;

  // Add the new card to the collections container
  const collectionsContainer = document.querySelector('.collections-container');
  collectionsContainer.appendChild(newCard);

  // Create a new HTML page with the templated HTML
  const newPage = window.open('', '_blank');
  newPage.document.open();
  newPage.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossorigin="anonymous" referrerpolicy="no-referrer" />

      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap" rel="stylesheet">
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">

      <link rel="stylesheet" href="../css/theme.css">
      <link rel="stylesheet" href="../css/base.css">
      <link rel="stylesheet" href="../css/style.css">
      <link rel="stylesheet" href="../css/pages.css">

      <script defer src="../js/main.js"></script>
      <script defer src="../js/collection.js"></script>

      <title>my.PokéData</title>
    </head>
    <body>
      <main class="site-wrapper">
        <header class="site-header">
          <nav id="topNav" class="navbar nav">
            <div class="container">
              <button class="navbar-toggler" aria-expanded="false" aria-controls="navbarDropdown">
                <span>&#9776;</span>
              </button>
              <a class="navbar-brand" href="../index.html">
                <div class="img-wrapper">
                  <img src="../assets/pokeball.png" alt="pokéball">
                </div>
                <h2>
                  my.<span style="color: #FFDE00;">Poké</span>Data
                </h2>
              </a>
              <ul class="navbar-nav">
                <li class="nav-link">
                  <a href="./index.html">Home</a>
                </li>
                <li class="nav-link">
                  <a href="./collections.html">Collections</a>
                </li>
                <li class="nav-link">
                  <a href="./favorites.html">Favorites</a>
                </li>
              </ul>
            </div>
          </nav>
        </header>

        <section class="site-content container">
          <div class="title-container">
            <h1 class="section-title">Collections</h1>
          </div>
          <div class="collections-container">
            <a class="collection-card create-new">
              <i class="fa-solid fa-plus"></i>
              <p>Add New<br>Collection</p>
            </a>        
            <a href="./collections/collection-1.html" class="collection-card">
              Collection #1
            </a>
            <a href="./collections/collection-1.html" class="collection-card">
              Collection #2
            </a>
            <a href="./collections/collection-1.html" class="collection-card">
              Collection #3
            </a>
            <a href="./collections/collection-1.html" class="collection-card">
              Collection #4
            </a>
            <a href="./collections/collection-1.html" class="collection-card">
              Collection #5
            </a>
          </div>
        </section>
      </main>
      <footer class="site-footer">
        <p>All content & design © my.PokéData, 2023. Pokémon images & names © 1995-2023 Nintendo/GameFreak. Data is from PokéAPI.</p>
      </footer>
    </body>
    </html>
  `);
  newPage.document.close();
};