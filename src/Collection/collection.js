// const pickArea = document.getElementById('pick-area')

// const skins = []
// for (let i = 0; i < 9; i++) {
//   const skinCardElement = {
//     active: i === 0 ? true : false,
//     opened: i < 2 ? true : false
//   }
//   skinCardElement.url = `../../Sprites/Card Skins/Preview/Skin_0${i+1}.png`
//   skins.push(createSkinsElement(skinCardElement))
// }

// function createSkinsElement() {
//   const cardElement = document.createElement('div')
//   const cardSkin = document.createElement('img')
//   const useBtn = document.createElement('button')
//   const statusIcon = document.createElement('img')

//   return cardElement
// }

const navList = document.getElementsByClassName('collection-nav-list')[0]

Array.from(navList.children).forEach((el) => {
  el.children[0].addEventListener('click', (e) => {
    Array.from(navList.children).forEach((el) => {
      el.children[0].classList.remove('active-btn')
    })
    e.target.classList.add('active-btn')
  })
})
