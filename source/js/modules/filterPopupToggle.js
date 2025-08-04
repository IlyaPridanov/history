export default function filterPopupToggle () {
  const filterPopup = document.querySelector('.filter__popup');
  const filterCaption = document.querySelector('.filter__caption');
  const btn = document.querySelector('.js-btn');
  const block = document.querySelector('.js-block');

  filterPopup.addEventListener('click', function (evt) {
    if (evt.target === this) {
      filterPopup.classList.remove('active');
    }
  })

  filterCaption.addEventListener('click', function (evt) {
    filterPopup.classList.add('active');
    btn.classList.remove('js-btn-active');
    block.classList.add('js-block-inactive');
  })
};
