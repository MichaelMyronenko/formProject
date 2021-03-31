$(function () {
    // if (window.matchMedia('(min-width: 1024px)').matches) {
    //     $('.carousel').myCarousel({visibleElements: 4, infinityMode: true, autoSwipe: true});
    // } else if (window.matchMedia('(min-width: 768px)').matches) {
        $('.carousel').myCarousel({visibleElements: 3, infinityMode: true, autoSwipe: true});
    // } else {
    //     $('.carousel').myCarousel({visibleElements: 1, infinityMode: true});
    // }
});

(function ($) {
    $.fn.myCarousel = function (options) {

        let params = $.extend({
            visibleElements: 2,
            swipeSlides: 1,
            animationSpeed: 500,
            infinityMode: false,
            autoSwipe: false,
            autoSwipeSpeed: 5000
        }, options);

        return this.each(function () {
            let visibleElements = params.visibleElements;
            let swipeSlides = params.swipeSlides;
            let absoluteElementWidth, relativeElementWidth, rowWidth, spacing, numOfElements;
            let infinityMode = params.infinityMode;
            let autoSwipes = params.autoSwipe;
            let position = 0;
            let carouselSelector = $(this);
            let rowSelector = $(carouselSelector.children(".slide-row"));
            let animationSpeed = params.animationSpeed;
            let slideshow, autoSwipeSpeed = params.autoSwipeSpeed;

            $('.button-prev').on('click', function () {
                if (infinityMode) {
                    moveLeftInfinity(animationSpeed);
                } else {
                    moveLeft(animationSpeed);
                }
            });

            $('.button-next').on('click', function () {
                if (infinityMode) {
                    moveRightInfinity(animationSpeed);
                } else {
                    moveRight(animationSpeed);
                }
            });
            if (infinityMode && autoSwipes) {
                moveSlidesAuto();
                rowSelector.hover(
                    function () {
                        clearInterval(slideshow);
                    },
                    function () {
                        moveSlidesAuto();
                    });
            }

            initAbsoluteElementWidth();
            initRelativeElementWidth();

            if (infinityMode) {
                for (let i = 1; i <= swipeSlides; i++) {
                    rowSelector.children(`.slider-item:nth-last-child(${((i * 2) - 1)})`).clone().prependTo(rowSelector);
                    rowSelector.children(`.slider-item:nth-child(${(i * 2)})`).clone().appendTo(rowSelector);
                }
                initPosition();
            }

            initSizes();

            function initPosition() {
                position = (-(absoluteElementWidth + spacing)) * swipeSlides;
                rowSelector.css("left", `${position}%`);
            }

            $(window).resize(function () {
                if (window.matchMedia('(min-width: 1024px)').matches) {
                    visibleElements = 4
                    swipeSlides = swipeSlides > 4 ? 4 : swipeSlides;
                } else if (window.matchMedia('(min-width: 768px)').matches) {
                    visibleElements = 3
                    swipeSlides = swipeSlides > 3 ? 3 : swipeSlides;
                } else if (window.matchMedia('(min-width: 500px)').matches){
                    visibleElements = 2
                    swipeSlides = swipeSlides > 2 ? 2 : swipeSlides;
                } else {
                    visibleElements = 1
                    swipeSlides = swipeSlides > 1 ? 1 : swipeSlides;
                }
                initAbsoluteElementWidth();
                initRelativeElementWidth();
                initPosition();
                initSizes();
            });

            function initAbsoluteElementWidth() {
                switch (visibleElements) {
                    case (1):
                        absoluteElementWidth = 90;
                        rowSelector.css("justify-content", "space-around");
                        break;
                    case (2):
                        absoluteElementWidth = 45;
                        rowSelector.css("justify-content", "space-between");
                        break;
                    case (3):
                        absoluteElementWidth = 31;
                        rowSelector.css("justify-content", "space-between");
                        break;
                    case (4):
                        absoluteElementWidth = 23;
                        rowSelector.css("justify-content", "space-between");
                        break;
                    default:
                        absoluteElementWidth = 15;
                        break;
                }
            }

            function initRelativeElementWidth() {
                relativeElementWidth = absoluteElementWidth;
                spacing = visibleElements === 1
                    ? 100 - (relativeElementWidth)
                    : (100 - (visibleElements * relativeElementWidth)) / (visibleElements - 1);
                numOfElements = rowSelector.find(".slider-item").length;
            }

            function initSizes() {
                rowWidth = calculateRowWidth();
                relativeElementWidth = calculateElementWidth();

                rowSelector.css("width", `${rowWidth}%`);
                rowSelector.children(".slider-item").css("width", `${relativeElementWidth}%`);
            }

            function calculateRowWidth() {
                numOfElements = rowSelector.find(".slider-item").length;
                return visibleElements === 1
                    ? (numOfElements * absoluteElementWidth) + (spacing * numOfElements)
                    : (numOfElements * absoluteElementWidth) + (spacing * (numOfElements - 1));
            }

            function calculateElementWidth() {
                numOfElements = rowSelector.find(".slider-item").length;
                return visibleElements === 1
                    ? ((100 - (spacing * (visibleElements))) / numOfElements)
                    : ((100 - (spacing * (visibleElements - 1))) / numOfElements);
            }

            function moveRightInfinity(speed) {
                rowSelector.queue(function () {
                    for (let i = 0; i < swipeSlides; i++) {
                        $(this).children(`.slider-item:nth-child(${((swipeSlides * 2) + 1)})`)
                            .clone().appendTo($(this));
                        $(this).children().first().remove();
                    }

                    position += (absoluteElementWidth + spacing) * swipeSlides;
                    $(this).css("left", `${position}%`);
                    position -= (absoluteElementWidth + spacing) * swipeSlides;
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: speed});
            }

            function moveLeftInfinity(speed) {
                rowSelector.queue(function () {
                    for (let i = 0; i < swipeSlides; i++) {
                        $(this).children(`.slider-item:nth-last-child(${((swipeSlides * 2) + 1)})`)
                            .clone().prependTo($(this));
                        $(this).children().last().remove();
                    }
                    position -= (absoluteElementWidth + spacing) * swipeSlides;
                    $(this).css("left", `${position}%`);
                    position += (absoluteElementWidth + spacing) * swipeSlides;
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: speed});
            }

            function moveLeft(speed) {
                rowSelector.queue(function () {
                    position += (absoluteElementWidth + spacing) * swipeSlides;
                    position = Math.min(position, 0);
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: speed});
            }

            function moveRight(speed) {
                rowSelector.queue(function () {
                    position -= (absoluteElementWidth + spacing) * swipeSlides;
                    position = Math.max(position, -(absoluteElementWidth + spacing) * (numOfElements - visibleElements));
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: speed});
            }

            function moveSlidesAuto() {
                slideshow = setInterval(function () {
                    moveRightInfinity(animationSpeed);
                }, autoSwipeSpeed);
            }
        });
    };
})(jQuery);