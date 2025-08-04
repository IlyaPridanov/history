export default function getHeaderMobile () {
    const btn = document.querySelectorAll('.js-btn');
    const block = document.querySelectorAll('.js-block');

    btn.forEach(function (btnItem) {
        btnItem.addEventListener('click' , function() {
            let t = this;
            btn.forEach(function (item) {
                if (!(item === t)) {
                    item.classList.remove('js-btn-active');
                }
            });
            btnItem.classList.toggle('js-btn-active');
            block.forEach(function (blockItem) {
                if (btnItem.dataset.block === blockItem.dataset.block) {
                    blockItem.classList.toggle('js-block-inactive');
                } else {
                    blockItem.classList.add('js-block-inactive');
                }
            });
        });
    });
};

