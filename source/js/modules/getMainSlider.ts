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
                speed: 800,
                navigation: {
                    nextEl: next,
                    prevEl: prev,
                },
                // updateOnWindowResize: false,
                slidesPerView: 1,
                spaceBetween: 0,
            });
        }
    };

    sliderContainers.forEach(function (currentValue): void  {
        const mediaQuery = window.matchMedia('(min-width: 769px)');
        const swiper = getBlockSlider(currentValue);
        if (!swiper) return;
        const pagination = currentValue.querySelector('.main-slider__pagination') as HTMLElement | null;
        if (!pagination) return;
        const bullets = Array.from(pagination.querySelectorAll('.main-slider__bullet')) as HTMLElement[];

        const baseRadius = 45;
        const bulletSize = 10;
        const radius = baseRadius + bulletSize / 2;
        const bulletCount = bullets.length;

        const bulletAngles: number[] = [];

        // Функция рапределения буллетов по кругу
        function setbulletDistribution() {
          bullets.forEach((bullet, i) => {
              const angle = (360 / bulletCount) * i - 60;
              bulletAngles[i] = angle;
              bullet.style.position = 'absolute';
              bullet.style.left = `${50 + radius * Math.cos(angle * Math.PI / 180)}%`;
              bullet.style.top = `${50 + radius * Math.sin(angle * Math.PI / 180)}%`;
              bullet.style.transform = 'translate(-50%, -50%) rotate(0deg)';
          });
        }

        if (mediaQuery.matches) {
          setbulletDistribution();
        }

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
        const valueEl = currentValue.querySelector('.main-slider__pagination-value') as HTMLElement | null;
        const sumEl = currentValue.querySelector('.main-slider__pagination-sum') as HTMLElement | null;
        const captionStartEl = currentValue.querySelector('.main-slider__caption-start') as HTMLElement | null;
        const captionEndEl = currentValue.querySelector('.main-slider__caption-end') as HTMLElement | null;

        // Анимация изменения числа
        function animateNumberChange(el: HTMLElement | null, to: number) {
            if (!el) return;
            let from = parseInt(el.textContent || '0', 10);
            if (isNaN(from)) from = to;
            if (from === to) return;
            const step = from < to ? 1 : -1;
            const duration = 300;
            const totalSteps = Math.abs(to - from);
            const interval = totalSteps ? Math.max(duration / totalSteps, 20) : duration;
            let current = from;
            const timer = setInterval(() => {
                current += step;
                el.textContent = String(current);
                if (current === to) clearInterval(timer);
            }, interval);
        }

        // Функция для обновления номера и суммы и дат
        function updateSliderNumbersAndDates() {
            if (!swiper) return;
            if (valueEl) valueEl.textContent = String(swiper.activeIndex + 1).padStart(2, '0');
            if (sumEl) sumEl.textContent = String(swiper.slides.length).padStart(2, '0');

            const activeSlide = swiper.slides[swiper.activeIndex] as HTMLElement;
            if (activeSlide) {
                const yearStart = parseInt(activeSlide.getAttribute('data-year-start') || '', 10);
                const yearEnd = parseInt(activeSlide.getAttribute('data-year-end') || '', 10);
                if (!isNaN(yearStart)) animateNumberChange(captionStartEl, yearStart);
                if (!isNaN(yearEnd)) animateNumberChange(captionEndEl, yearEnd);
            }
        }
        // Изначально активный
        updateActiveBullet(swiper.activeIndex);
        if (mediaQuery.matches) {
          setBulletsRotation(0);
          rotatePaginationTo(swiper.activeIndex);
        }
        updateSliderNumbersAndDates();
        // При смене слайда
        swiper.on('slideChange', () => {
            updateActiveBullet(swiper.activeIndex);
            if (mediaQuery.matches) {
                rotatePaginationTo(swiper.activeIndex);
            }
            updateSliderNumbersAndDates();
        });
        // Клик по буллету
        bullets.forEach((bullet, i) => {
            bullet.addEventListener('click', () => {
                swiper.slideTo(i);
                if (mediaQuery.matches) {
                    rotatePaginationTo(i);
                }
                updateSliderNumbersAndDates();
            });
        });
    });
}
