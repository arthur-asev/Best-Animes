import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import images from '../../assets/images/index';
import "slick-carousel/slick/slick-theme.css";

 function MultipleItems(){

     const settings = {
         infinite: true,
         speed: 500,
         arrows:false,
         slidesToShow: 7,
         slidesToScroll: 2,
         autoplay:true,
         autoplaySpeed: 4000,
         pauseOnHover: true,
         dots:true,
         responsive: [
             {
                 breakpoint: 1024,
                 settings: {
                     slidesToShow: 3,
                     slidesToScroll: 3,
                     infinite: true,
                     dots:false,
                 }
             },
             {
                 breakpoint: 600,
                 settings: {
                     slidesToShow: 2,
                     slidesToScroll: 2,
                     initialSlide: 2,
                     dots:false,
                     infinite: true,
                 }
             },
             {
                 breakpoint: 480,
                 settings: {
                     slidesToShow: 1,
                     slidesToScroll: 1,
                     dots:false,
                     infinite: true,
                 }
             }
         ]
     };

     return (
         <div  id="carousel">
             <Slider {...settings}>
                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.dale} alt="image no found" />
                         <p>Hero mask</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.jujutsu} alt="image no found" />
                         <p>Jujutsu Kaisen</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.slime} alt="image no found" />
                         <p>Jujutsu Kaisen</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.tatakae} alt="image no found" />
                         <p>Shingeki no Kyojin</p>
                     </a>
                 </div>
                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.dale} alt="image no found" />
                         <p>Hero mask</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.jujutsu} alt="image no found" />
                         <p>Jujutsu Kaisen</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.slime} alt="image no found" />
                         <p>Jujutsu Kaisen</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.tatakae} alt="image no found" />
                         <p>Shingeki no Kyojin</p>
                     </a>
                 </div>    <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.dale} alt="image no found" />
                         <p>Hero mask</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.jujutsu} alt="image no found" />
                         <p>Jujutsu Kaisen</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.slime} alt="image no found" />
                         <p>Jujutsu Kaisen</p>
                     </a>
                 </div>

                 <div className="thumb">
                     <a className="thumbLink" href="">
                         <img src={images.tatakae} alt="image no found" />
                         <p>Shingeki no Kyojin</p>
                     </a>
                 </div>
                 
                 
                 

             </Slider>
         </div>


     );
}

export default MultipleItems;



