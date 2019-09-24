var learnObj = {};

learnObj.learnSlide = function (slideIndex) {

  jQuery('.app-slider').not('.slick-initialized').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    centerMode: true,
    centerPadding: "60px",
    infinite: false
  });

  jQuery('.app-slider').slick('slickGoTo', slideIndex);

};
