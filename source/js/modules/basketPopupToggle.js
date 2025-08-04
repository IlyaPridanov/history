export default function basketPopupToggle () {
  const basket = document.querySelector('.basket');
  const basketButton = document.querySelector('.header__basket-btn');
  const basketClose = document.querySelector('.basket__close');
  const btn = document.querySelector('.js-btn');
  const block = document.querySelector('.js-block');

  basket.addEventListener('click', function (evt) {
    if (evt.target === this) {
      basket.classList.remove('active');
    }
  })

  basketClose.addEventListener('click', function () {
    basket.classList.remove('active');
  })

  basketButton.addEventListener('click', function () {
    basket.classList.add('active');
    btn.classList.remove('js-btn-active');
    block.classList.add('js-block-inactive');
  })
};
