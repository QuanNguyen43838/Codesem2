$(document).ready(function () {
    $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        items: 1,
        autoplay: true,
        autoplayTimeout: 3000,
        smartSpeed: 1000,
        autoplayHoverPause: false,
        dots: true
    });
});


document.addEventListener('DOMContentLoaded', function () {
    var filterCategories = document.querySelectorAll('.filter-category h4');

    filterCategories.forEach(function (h4) {
        h4.addEventListener('click', function () {
            var parent = h4.parentElement;
            parent.classList.toggle('active');
        });
    });
});