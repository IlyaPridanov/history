export default function basketPopupToggle(): void {
  const basket = document.querySelector('.basket') as HTMLElement | null;
  const basketButton = document.querySelector('.header__basket-btn') as HTMLElement | null;
  const basketClose = document.querySelector('.basket__close') as HTMLElement | null;
  const btn = document.querySelector('.js-btn') as HTMLElement | null;
  const block = document.querySelector('.js-block') as HTMLElement | null;

  if (!basket || !basketButton || !basketClose || !btn || !block) return;

  basket.addEventListener('click', function (evt: MouseEvent) {
    if (evt.target === this) {
      basket.classList.remove('active');
    }
  });

  basketClose.addEventListener('click', function () {
    basket.classList.remove('active');
  });

  basketButton.addEventListener('click', function () {
    basket.classList.add('active');
    btn.classList.remove('js-btn-active');
    block.classList.add('js-block-inactive');
  });
}
