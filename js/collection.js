const cardsContainer = document.querySelector('.grid-container');
export const favoriteData = [];

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
    pokemonDataArray.forEach(pokemonData => {
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
        tooltip.textContent = `Height: ${pokemonData.height}\nWeight: ${pokemonData.weight}\nBase Experience: ${pokemonData.base_experience}\nHP: ${pokemonData.stats[0].base_stat}\nAttack: ${pokemonData.stats[1].base_stat}\nDefense: ${pokemonData.stats[2].base_stat}`;
        tooltip.appendChild(tooltipText);

        // Create favorite button
        const favoriteButton = document.createElement('button');
        favoriteButton.textContent = 'Favorite';
        favoriteButton.className = 'favorite-btn';

        // Add event listener to the favorite button
        favoriteButton.addEventListener('click', () => {
          favoriteData.push(pokemonData.id);
          localStorage.setItem('favorites', JSON.stringify(favoriteData));
        });

        // Add favorite button to tooltip element
        tooltip.appendChild(favoriteButton);
        // Add tooltip to card top element
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

      // Create the name element and set its text content
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
    });
  });

