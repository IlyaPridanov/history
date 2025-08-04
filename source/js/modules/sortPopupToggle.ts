export default function sortPopupToggle(): void {
  const sortPopup = document.querySelector('.sort__popup') as HTMLElement | null;
  const sortButton = document.querySelector('.sort__button') as HTMLElement | null;
  const btn = document.querySelector('.js-btn') as HTMLElement | null;
  const block = document.querySelector('.js-block') as HTMLElement | null;

  if (!sortPopup || !sortButton || !btn || !block) return;

  sortPopup.addEventListener('click', function (evt: MouseEvent) {
    if (evt.target === this) {
      sortPopup.classList.remove('active');
    }
  });

  sortButton.addEventListener('click', function () {
    sortPopup.classList.add('active');
    btn.classList.remove('js-btn-active');
    block.classList.add('js-block-inactive');
  });
}
