export default function filterPopupToggle(): void {
  const filterPopup = document.querySelector('.filter__popup') as HTMLElement | null;
  const filterCaption = document.querySelector('.filter__caption') as HTMLElement | null;
  const btn = document.querySelector('.js-btn') as HTMLElement | null;
  const block = document.querySelector('.js-block') as HTMLElement | null;

  if (!filterPopup || !filterCaption || !btn || !block) return;

  filterPopup.addEventListener('click', function (evt: MouseEvent) {
    if (evt.target === this) {
      filterPopup.classList.remove('active');
    }
  });

  filterCaption.addEventListener('click', function () {
    filterPopup.classList.add('active');
    btn.classList.remove('js-btn-active');
    block.classList.add('js-block-inactive');
  });
}
