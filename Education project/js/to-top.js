$(function () {
    let btn = $('.to-top-button');

    $(window).scroll(function() {
        if ($(window).scrollTop() > 100) {
            btn.addClass('show-top-button');
        } else {
            btn.removeClass('show-top-button');
        }
    });

    btn.on('click', function () {
        $('body,html').animate({scrollTop: 0}, 1000);
    });
});