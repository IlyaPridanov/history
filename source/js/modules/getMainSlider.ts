import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';

export default function getMainSlider(): void {
    const sliderContainers = document.querySelectorAll<HTMLElement>('.main-slider');

    const getBlockSlider = function (slider: HTMLElement): Swiper | undefined {
        const container = slider.querySelector('.main-slider__swiper-container') as HTMLElement | null;
        const slides = slider.querySelectorAll('.main-slider__swiper-slide');
        const prev = slider.querySelector('.main-slider__btn-next') as HTMLElement | null;
        const next = slider.querySelector('.main-slider__btn-prev') as HTMLElement | null;
        const loop = false;
        const allowTouchMove = false;
        const direction = 'horizontal';
        const autoHeight = false;
        const breakpoints = {
            320: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            768: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            1200: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
        };
        if (slides.length >= 2 && container) {
            return new Swiper(container, {
                modules: [Navigation, Pagination, EffectFade],
                direction: direction,
                allowTouchMove: allowTouchMove,
                loop: loop,
                autoHeight: autoHeight,
                effect: 'fade',
                fadeEffect: {
                    crossFade: true,
                },
                // speed: 800,
                navigation: {
                    nextEl: next,
                    prevEl: prev,
                },
                // updateOnWindowResize: false,
                breakpoints: breakpoints,
            });
        }
    };

    sliderContainers.forEach(function (currentValue): void  {
        const swiper = getBlockSlider(currentValue);
        if (!swiper) return;
        const pagination = currentValue.querySelector('.main-slider__pagination');
        if (!pagination) return;
        const bullets = Array.from(pagination.querySelectorAll('.main-slider__pagination-bullet'));
        // Функция для обновления активного буллета
        function updateActiveBullet(index: number) {
            bullets.forEach((bullet, i) => {
                bullet.classList.toggle('is-active', i === index);
            });
        }
        // Изначально активный
        updateActiveBullet(swiper.activeIndex);
        // При смене слайда
        swiper.on('slideChange', () => {
            updateActiveBullet(swiper.activeIndex);
        });
        // Клик по буллету
        bullets.forEach((bullet, i) => {
            bullet.addEventListener('click', () => {
                swiper.slideTo(i);
            });
        });
    });
}
