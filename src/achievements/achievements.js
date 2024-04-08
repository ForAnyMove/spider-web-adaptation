
const navList = document.getElementsByClassName('collection-nav-list')[0]

Array.from(navList.children).forEach((el) => {
  el.children[0].addEventListener('click', (e) => {
    Array.from(navList.children).forEach((el) => {
      el.children[0].classList.remove('active-btn')
    })
    e.target.classList.add('active-btn')
  })
})
