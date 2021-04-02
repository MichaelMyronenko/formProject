$(function () {
    $('.carousel').myCarousel({
        visibleElements: [{minScreenWidth: 768, visibleElems: 3},
            {minScreenWidth: 1024, visibleElems: 4},
            {minScreenWidth: 500, visibleElems: 2},
            {minScreenWidth: 0, visibleElems: 1}],
        swipeSlides: 2,
        infinityMode: true,
        autoSwipe: true
    });
    $('.second-carousel').myCarousel({
        visibleElements: [{minScreenWidth: 768, visibleElems: 3},
            {minScreenWidth: 1024, visibleElems: 5},
            {minScreenWidth: 0, visibleElems: 2}],
        infinityMode: false,
        swipeSlides: 1,
        autoSwipe: false
    });
});

(function ($) {
    $.fn.myCarousel = function (options) {
        let sizeSet = {
            minScreenWidth: 768,
            visibleElems: 1
        };

        let params = $.extend({
            visibleElements: [sizeSet],
            swipeSlides: 1,
            animationSpeed: 500,
            infinityMode: false,
            autoSwipe: false,
            autoSwipeSpeed: 5000
        }, options);

        return this.each(function () {
            sortSizeSets();
            let infinityMode = params.infinityMode;
            let swipeSlides = params.swipeSlides;
            let autoSwipes = params.autoSwipe;
            let animationSpeed = params.animationSpeed;
            let slideshow, autoSwipeSpeed = params.autoSwipeSpeed;
            let carouselSelector = $(this);
            let rowSelector = $(carouselSelector.children(".slide-row"));
            let absoluteElementWidth, relativeElementWidth, rowWidth, spacing;
            let position = 0;
            let numOfSwipe = 0;
            let numOfElements = getNumOfElements();
            let numOfOriginalElements = numOfElements;
            let visibleElements = getVisibleElements();

            firstInit();
            setRowJustifyContent();

            if (infinityMode && autoSwipes) {
                moveSlidesAuto();
                $('.slide-row, [class*="arrow"]').hover(
                    function () {
                        clearInterval(slideshow);
                    },
                    function () {
                        moveSlidesAuto();
                    });
            }

            $('.button-prev').on('click', function () {
                if (infinityMode) {
                    moveLeftInfinity();
                } else {
                    moveLeft();
                }
            });

            $('.button-next').on('click', function () {
                if (infinityMode) {
                    moveRightInfinity();
                } else {
                    moveRight();
                }
            });

            carouselSelector.on('click', " .num-of-slide", function () {
                moveOnPoint($(this));
            });

            $(window).resize(function () {
                visibleElements = getVisibleElements();
                absoluteElementWidth = getAbsoluteElementWidth();
                spacing = getSpacing();
                if (infinityMode) {
                    initPosition();
                }
                init();
                if (!infinityMode) {
                    checkPosition();
                }
                setRowJustifyContent();
            });

            function addClones() {
                for (let i = 1; i <= swipeSlides; i++) {
                    rowSelector.children(`.slider-item:nth-last-child(${((i * 2) - 1)})`).clone().prependTo(rowSelector);
                    rowSelector.children(`.slider-item:nth-child(${(i * 2)})`).clone().appendTo(rowSelector);
                }
            }

            function initPosition() {
                position = (-(absoluteElementWidth + spacing)) * swipeSlides;
                rowSelector.css("left", `${position}%`);
            }

            function firstInit() {
                absoluteElementWidth = getAbsoluteElementWidth();
                spacing = getSpacing();
                numOfElements = getNumOfElements();
                numOfOriginalElements = numOfElements;
                if (infinityMode) {
                    addClones();
                    initPosition();
                } else {
                    setPoints();
                }
                rowWidth = calculateRowWidth();
                relativeElementWidth = calculateElementWidth();

                rowSelector.css("width", `${rowWidth}%`);
                rowSelector.children(".slider-item").css("width", `${relativeElementWidth}%`);
            }

            function init() {
                absoluteElementWidth = getAbsoluteElementWidth();
                spacing = getSpacing();
                numOfElements = getNumOfElements();
                rowWidth = calculateRowWidth();
                relativeElementWidth = calculateElementWidth();
                setPoints();

                rowSelector.css("width", `${rowWidth}%`);
                rowSelector.children(".slider-item").css("width", `${relativeElementWidth}%`);
            }

            function setRowJustifyContent() {
                if (visibleElements === 1) {
                    rowSelector.css("justify-content", "space-around");
                } else {
                    rowSelector.css("justify-content", "space-between");
                }
            }

            function getNumOfElements() {
                return rowSelector.find(".slider-item").length;
            }

            function checkPosition() {
                position = -((absoluteElementWidth + spacing) * swipeSlides) * numOfSwipe;
                position = position < getLastPosition() ? getLastPosition() : position;
                rowSelector.css("left", `${position}%`);
            }

            function sortSizeSets() {
                params.visibleElements.sort(function (a, b) {
                    if (a.minScreenWidth > b.minScreenWidth) {
                        return -1;
                    } else {
                        return 1;
                    }
                });
            }

            function getVisibleElements() {
                let visElems = 1;
                updateOriginalElements();
                for (let i = 0; i < params.visibleElements.length; i++) {
                    let minWidth = params.visibleElements[i].minScreenWidth;
                    if (window.matchMedia(`(min-width: ${minWidth}px)`).matches) {
                        visElems = params.visibleElements[i].visibleElems;
                        visElems = visElems > numOfOriginalElements ? numOfOriginalElements : visElems;
                        swipeSlides = swipeSlides > visElems ? visElems : params.swipeSlides;
                        return visElems;
                    }
                }
                return visElems;
            }

            function getAbsoluteElementWidth() {
                let elementsWidthSum = 90;

                if (visibleElements > 1) {
                    return elementsWidthSum / visibleElements;
                } else {
                    return elementsWidthSum;
                }
            }

            function updateOriginalElements() {
                if (infinityMode && (numOfElements !== numOfOriginalElements)) {
                    numOfOriginalElements = getNumOfElements() - (2 * swipeSlides);
                } else {
                    numOfOriginalElements = getNumOfElements();
                }
            }

            function getSpacing() {
                return visibleElements === 1
                    ? 100 - (absoluteElementWidth)
                    : (100 - (visibleElements * absoluteElementWidth)) / (visibleElements - 1);
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

            function moveLeft() {
                rowSelector.queue(function () {
                    let oldPosition = position;
                    position += (absoluteElementWidth + spacing) * swipeSlides;
                    position = Math.min(position, 0);
                    numOfSwipe = oldPosition === position ? numOfSwipe : numOfSwipe - 1;
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: animationSpeed}).dequeue();
            }

            function moveRight() {
                rowSelector.queue(function () {
                    let oldPosition = position;
                    position -= (absoluteElementWidth + spacing) * swipeSlides;
                    position = Math.max(position, getLastPosition());
                    numOfSwipe = oldPosition === position ? numOfSwipe : numOfSwipe + 1;
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: animationSpeed}).dequeue();
            }

            function moveOnPoint(swipe) {
                rowSelector.queue(function () {
                    numOfSwipe = swipe.index();
                    let oldPosition = position;
                    position = -((absoluteElementWidth + spacing) * swipeSlides) * numOfSwipe;
                    if (oldPosition > position) {
                        position = Math.max(position, getLastPosition());
                    } else if (oldPosition < position) {
                        position = Math.min(position, 0);
                    }
                    $(this).dequeue();
                }).animate({left: `${position}%`}, {duration: animationSpeed}).dequeue();
            }

            function getNumOfSwipes() {
                return Math.ceil((numOfElements - visibleElements) / swipeSlides) + 1;
            }

            function setPoints() {
                let numOfPoints = getNumOfSwipes();
                carouselSelector.find('.num-of-slide').slice(1).remove();
                for (let i = 1; i < numOfPoints; i++) {
                    carouselSelector.find('.num-of-slide').first().clone()
                        .prependTo(carouselSelector.find('.slides-dots-group'));
                }
            }

            function moveSlidesAuto() {
                slideshow = setInterval(function () {
                    moveRightInfinity(animationSpeed);
                }, autoSwipeSpeed);
            }

            function getLastPosition() {
                return -(absoluteElementWidth + spacing) * (numOfElements - visibleElements);
            }
        });
    };
})(jQuery);