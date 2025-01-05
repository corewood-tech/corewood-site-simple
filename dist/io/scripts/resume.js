const configureCarousel = () => {
    const carousel = document.querySelector('.carousel');
    const slides = carousel.querySelectorAll('.carousel-slide');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    currentSlide = 1;
    showSlide(currentSlide);
    // Auto advance every 5 seconds
    let timer = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);

    function resetTimer () {
        clearInterval(timer);
        timer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5500);
    };

    carousel.querySelector('.prev').addEventListener('click', () => {
        showSlide(currentSlide - 1);
        resetTimer();
    });

    carousel.querySelector('.next').addEventListener('click', () => {
        showSlide(currentSlide + 1);
        resetTimer();
    });
}

const highlightSkills = () => {
    document.querySelectorAll('.experience-item').forEach(item => {
        item.addEventListener('mouseover', () => {
            skillIds = item.dataset.skillIds || [];
            skillTags = Array.from(document.querySelectorAll('.skill-tag'));
            
            hlSkills = skillTags.filter(skill => skillIds.includes(skill.dataset.skillId));
            skillTags.forEach(tag => tag.classList.remove('skill-highlight'));
            hlSkills.forEach(tag => tag.classList.add('skill-highlight'));
        });
    });
    document.querySelectorAll('.resume-section').forEach(section => {
        section.addEventListener('mouseleave', () => {
            skillTags = Array.from(document.querySelectorAll('.skill-tag'));
            skillTags.forEach(tag => tag.classList.remove('skill-highlight'));
        });
    });
};

document.addEventListener('DOMContentLoaded', function () {
    configureCarousel();
    highlightSkills();
});
