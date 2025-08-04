import Swiper from 'swiper';

export default function getSlider () {
    const sliderContainers = document.querySelectorAll('.slider');

    const getBlockSlider = function (slider) {
        if (slider) {
            const container = slider.querySelector('.swiper-container');
            const slides = slider.querySelectorAll('.swiper-slide');
            const prev = slider.querySelector('.js-btn-next');
            const next = slider.querySelector('.js-btn-prev');
            const pagination = slider.querySelector('.swiper-pagination');
            const loop = true;
            const allowTouchMove = true;
            const direction = 'horizontal';
            const autoHeight = true;
            const breakpoints = {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 7,
                },
                768: {
                    slidesPerView: 1,
                    spaceBetween: 15,
                },
                1200: {
                    slidesPerView: 1,
                    spaceBetween: 24,
                },
            };
            if (slides.length >= 2) {
                return new Swiper(container, {
                    direction: direction,
                    allowTouchMove: allowTouchMove,
                    loop: loop,
                    autoHeight: autoHeight,
                    navigation: {
                        nextEl: next,
                        prevEl: prev,
                    },
                    // updateOnWindowResize: false,
                    pagination: {
                        el: pagination,
                        clickable: true,
                    },
                    breakpoints: breakpoints,
                });
            }
        }
    };

    sliderContainers.forEach(function (currentValue) {
        getBlockSlider(currentValue);
    });
};
