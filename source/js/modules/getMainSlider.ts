import Swiper from 'swiper';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import gsap from 'gsap';

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
        const pagination = currentValue.querySelector('.main-slider__pagination') as HTMLElement | null;
        if (!pagination) return;
        const bullets = Array.from(pagination.querySelectorAll('.main-slider__bullet')) as HTMLElement[];
        // Размещение буллетов по кругу
        const baseRadius = 45; // базовый радиус окружности (px)
        const bulletSize = 10; // диаметр буллета (px), скорректируйте под ваш дизайн
        const radius = baseRadius + bulletSize / 2; // теперь центр буллета будет на линии окружности
        const bulletCount = bullets.length;
        // Сохраним индивидуальные углы для каждого буллета
        const bulletAngles: number[] = [];
        bullets.forEach((bullet, i) => {
            const angle = (360 / bulletCount) * i - 60;
            bulletAngles[i] = angle;
            bullet.style.position = 'absolute';
            bullet.style.left = `${50 + radius * Math.cos(angle * Math.PI / 180)}%`;
            bullet.style.top = `${50 + radius * Math.sin(angle * Math.PI / 180)}%`;
            bullet.style.transform = 'translate(-50%, -50%) rotate(0deg)'; // изначально без поворота
        });
        // Функция для установки правильного угла всем буллетам
        function setBulletsRotation(containerAngle: number) {
            bullets.forEach((bullet) => {
                bullet.style.transform = `translate(-50%, -50%) rotate(${-containerAngle}deg)`;
            });
        }
        // Функция для обновления активного буллета
        function updateActiveBullet(index: number) {
            bullets.forEach((bullet, i) => {
                bullet.classList.toggle('is-active', i === index);
            });
        }
        // Анимация вращения круга и counter-rotate для буллетов
        function rotatePaginationTo(index: number) {
            const anglePerBullet = 360 / bulletCount;
            const targetAngle = -anglePerBullet * index;
            gsap.to(pagination, {
                rotate: targetAngle,
                duration: 0.6,
                ease: 'power2.inOut',
                onUpdate: () => {
                    const computed = gsap.getProperty(pagination, 'rotate') as number;
                    setBulletsRotation(computed);
                },
                onComplete: () => {
                    const computed = gsap.getProperty(pagination, 'rotate') as number;
                    setBulletsRotation(computed);
                }
            });
        }
        // Изначально активный
        updateActiveBullet(swiper.activeIndex);
        setBulletsRotation(0); // выставляем правильный угол для всех буллетов при загрузке
        rotatePaginationTo(swiper.activeIndex);
        // При смене слайда
        swiper.on('slideChange', () => {
            updateActiveBullet(swiper.activeIndex);
            rotatePaginationTo(swiper.activeIndex);
        });
        // Клик по буллету
        bullets.forEach((bullet, i) => {
            bullet.addEventListener('click', () => {
                swiper.slideTo(i);
                rotatePaginationTo(i);
            });
        });
    });
}
