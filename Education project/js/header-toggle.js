jQuery(function () {
   $('.menu-button').on('click', function () {
      $(this).toggleClass('menu-button-clicked');
      $('.menu-box').toggleClass('menu-box-open');
      $('body').toggleClass('body-scroll-locked')
   });
});