export default function getHeaderMobile(): void {
    const btn = document.querySelectorAll<HTMLButtonElement | HTMLElement>('.js-btn');
    const block = document.querySelectorAll<HTMLElement>('.js-block');

    btn.forEach(function (btnItem) {
        btnItem.addEventListener('click', function (this: HTMLElement) {
            const t = this;
            btn.forEach(function (item) {
                if (!(item === t)) {
                    item.classList.remove('js-btn-active');
                }
            });
            btnItem.classList.toggle('js-btn-active');
            block.forEach(function (blockItem) {
                if ((btnItem as HTMLElement).dataset.block === blockItem.dataset.block) {
                    blockItem.classList.toggle('js-block-inactive');
                } else {
                    blockItem.classList.add('js-block-inactive');
                }
            });
        });
    });
}
