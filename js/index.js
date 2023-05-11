function loadCards() {
  while (cardsContainer.firstChild) {
    cardsContainer.removeChild(cardsContainer.firstChild);
  }
  
    getPokemon().then(pokemon => {
      addCards(pokemon);
      updatePageNumber();
    });
}

function updatePageNumber() {
    const pageNumber = document.querySelector('.current-page');
    if (pageNumber) {
      pageNumber.textContent = currentPage;
    }
}

loadCards();