document.addEventListener('DOMContentLoaded', function () {
    const carousel = document.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');

    function maxLengthSlideIdx() {
        const maxLen = Math.max(...Array.from(slides).map(slide => slide.textContent.length));
        return Array.from(slides).findIndex(slide => slide.textContent.length === maxLen);
    }

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    // Load the longest rec first & set the height so we don't bounce
    let currentSlide = maxLengthSlideIdx();
    showSlide(currentSlide);
    carousel.style.height = slides[currentSlide].clientHeight + 'px';


    // Auto advance every 5 seconds
    let timer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    function resetTimer () {
        clearInterval(timer);
        timer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    };

    carousel.querySelector('.prev').addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetTimer();
    });

    carousel.querySelector('.next').addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetTimer();
    });
});
