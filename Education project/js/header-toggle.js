$(function () {
   $('.menu-button').on('click', function () {
      $(this).toggleClass('menu-button-clicked');
      $('.menu-box').toggleClass('menu-box-open');
      $('body').toggleClass('body-scroll-locked')
   });

   $('.menu-item').on('click', function () {
      $('.menu-button').removeClass('menu-button-clicked');
      $('.menu-box').removeClass('menu-box-open');
      $('body').removeClass('body-scroll-locked');
   });
});