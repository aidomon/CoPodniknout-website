$(document).ready(function(){
    $('.center').slick({
        lazyLoad: 'ondemand',
        ease : 'Pow4.easeIn',
        dots: true,
        arrows: false,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: false,
        variableWidth: true,
        pauseOnHover: true,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
          {
              breakpoint: 1024,
              settings: {
                  slidesToShow: 3,
                  infinite: true,
                  dots: true
              }
          },
          {
              breakpoint: 620,
              settings: {
              slidesToShow: 2,
              }
          },
          {
              breakpoint: 480,
              settings: {
              slidesToShow: 1,
              }
          }
      ]
      });
});