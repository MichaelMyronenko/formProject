$(function () {
    let carousel = $(".second-carousel");
    let numOfSlides;
    let numOfDot = 1;

    carousel.on('click', " .num-of-slide", function () {
        let floatDot = $(`.float-dot`);
        let newPosition;
        $(this).queue(function () {
            numOfSlides = $(this).parent().find('.num-of-slide').length;
            numOfDot = $(this).index() + 1;
            newPosition = ((numOfDot * 2) - 1) * (100 / numOfSlides) / 2;
            floatDot
                .animate({left: `${newPosition}%`}, {duration: 500}).dequeue();
            $(this).dequeue();
        });
    });

    carousel.ready(function () {
        numOfSlides = $('.slides-dots-group').find('.num-of-slide').length;

        carousel.find('.slider-counter').css("width", `${numOfSlides * 20}px`);

        let position = (100 / numOfSlides) / 2;
        $(`.float-dot`).css({"left": `${position}%`, "opacity" : "1"});
    });

    $(window).resize(function () {
        numOfSlides = $('.slides-dots-group').find('.num-of-slide').length;

        carousel.find('.slider-counter').css("width", `${numOfSlides * 20}px`);

        numOfDot = numOfDot > numOfSlides ? numOfSlides : numOfDot;
        let newPosition = ((numOfDot * 2) - 1) * (100 / numOfSlides) / 2;
        $(`.float-dot`).css({"left": `${newPosition}%`, "opacity" : "1"});
    });
});