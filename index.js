let mask = document.querySelector('.mask');

window.addEventListener('load', () => {
  mask.classList.add('hide');
  setTimeout(() => {
    mask.remove();
  }, 600);
});

const closeDailyPopupButton = document.getElementById('close-popup-daily');
const dailyBonuses = document.getElementById('daily-bonuses');
const dailyBtn = document.getElementById('daily-btn');

dailyBtn.addEventListener('click', () => {
  dailyBonuses.style.display = 'flex';
});

closeDailyPopupButton.addEventListener('click', function () {
  dailyBonuses.style.display = 'none';
});

const closeRegularPopupButton = document.getElementById('close-popup-regular');
const regularBonuses = document.getElementById('regular-bonuses');
const regularBtn = document.getElementById('regular-btn');

regularBtn.addEventListener('click', () => {
  regularBonuses.style.display = 'flex';
});

closeRegularPopupButton.addEventListener('click', function () {
  regularBonuses.style.display = 'none';
});

const closeSettingsPopupButton = document.getElementById('close-popup-settings');
const settingsBonuses = document.getElementById('settings');
const settingsBtn = document.getElementById('settings-btn');

settingsBtn.addEventListener('click', () => {
  settingsBonuses.style.display = 'flex';
});

closeSettingsPopupButton.addEventListener('click', function () {
  settingsBonuses.style.display = 'none';
});
