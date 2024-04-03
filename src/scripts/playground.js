const extraCardsContainer = document.getElementById('extra-cards-container')

for (let i = 0; i<54; i++) {
  const randomCardElement = document.createElement('div')
  randomCardElement.classList.add('card-element', 'closed')
  extraCardsContainer.appendChild(randomCardElement)
}