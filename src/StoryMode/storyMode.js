// const levelButtons = document.getElementsByClassName('level-btn')
const levelButtonsContainer = document.getElementsByClassName('story-map-container')[0]

const closePopupButton = document.getElementById('close-popup');
const popup = document.getElementById('popup');
levelButtonsContainer.addEventListener('click', (event) => {
  console.dir(event.target);
  if (event.target.matches('.level-btn')) {
    // console.log('btn');
    const levelBtn = event.target
    // console.log(popup.style.display);
    popup.style.display = 'flex'
    // levelBtn.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
})
  
  closePopupButton.addEventListener('click', function() {
      popup.style.display = 'none';
  });  

  window.addEventListener('resize', () => {
    console.log('resize');
    popup.style.width = window.innerWidth;
    popup.style.height = window.innerHeight
  })