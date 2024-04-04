const extraCardsContainer = document.getElementById('extra-cards-container');

for (let i = 0; i < 54; i++) {
  const randomCardElement = document.createElement('div');
  randomCardElement.classList.add('card-element', 'closed');
  extraCardsContainer.appendChild(randomCardElement);
}


// const cardsCollection = [];

// for (let id = 0; id < 54; id++) {
//   const imageLink = `../../Sprites/.../Icon_${id}`;

//   cardsCollection.push(createCard(imageLink));
// }

// function createCard(imageLink) {
//   const cardElement = document.createElement('div');
//   cardElement.style.backgroundImage = `url('${imageLink}`;
//   cardElement.style.backgroundSize = `100% 100%`;
//   return cardElement;
// }
