import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

export default function getSlider(): void {
    const sliderContainers = document.querySelectorAll<HTMLElement>('.slider');

    const getBlockSlider = function (slider: HTMLElement): Swiper | undefined {
        const container = slider.querySelector('.swiper-container') as HTMLElement | null;
        const slides = slider.querySelectorAll('.swiper-slide');
        const prev = slider.querySelector('.js-btn-prev') as HTMLElement | null;
        const next = slider.querySelector('.js-btn-next') as HTMLElement | null;
        const pagination = slider.querySelector('.swiper-pagination') as HTMLElement | null;
        const loop = false;
        const allowTouchMove = true;
        const direction = 'horizontal';
        const autoHeight = false;
        const breakpoints = {
            320: {
                slidesPerView: 1.5,
                spaceBetween: 7,
            },
            768: {
                slidesPerView: 3,
                spaceBetween: 15,
            },
            1200: {
                slidesPerView: 3,
                spaceBetween: 50,
            },
        };
        if (slides.length >= 2 && container) {
            return new Swiper(container, {
                modules: [Navigation, Pagination],
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
    };

    sliderContainers.forEach(function (currentValue) {
        getBlockSlider(currentValue);
    });
}
