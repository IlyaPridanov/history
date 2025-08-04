export default function sortPopupToggle () {
  const sortPopup = document.querySelector('.sort__popup');
  const sortButton = document.querySelector('.sort__button');
  const btn = document.querySelector('.js-btn');
  const block = document.querySelector('.js-block');

  sortPopup.addEventListener('click', function (evt) {
    if (evt.target === this) {
      sortPopup.classList.remove('active');
    }
  })

  sortButton.addEventListener('click', function (evt) {
    sortPopup.classList.add('active');
    btn.classList.remove('js-btn-active');
    block.classList.add('js-block-inactive');
  })
};
