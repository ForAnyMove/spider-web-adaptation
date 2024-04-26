const openTestBtn = document.getElementById('challenge-test')
const testChallengeScreen = document.getElementById('challenges-test-screen')
const mainTab = document.getElementById('main-screen')
openTestBtn.addEventListener('click', () => {
  console.log(testChallengeScreen);
  testChallengeScreen.style.display = 'flex'
  mainTab.style.display = 'none'
})
function testAdd() {

  const container = document.getElementsByClassName('challenges-test-container')[0]
  for (let i = 0; i < 15; i++) {

    const challengeTestCard = document.createElement('div')
    challengeTestCard.classList.add('challenge-test-container')
    container.appendChild(challengeTestCard)
  }
}

testAdd();