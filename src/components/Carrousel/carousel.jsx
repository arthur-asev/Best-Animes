
"use client";
import React from "react";
import dynamic from "next/dynamic";
import images from '../../assets/images/';
import Image from "next/image";

const Slider = dynamic(() => import("react-slick"), { ssr: false });

function MultipleItems() {

    const settings = {
        infinite: true,
        speed: 500,
        arrows: false,
        slidesToShow: 5,
        slidesToScroll: 2,
        autoplay: true,
        autoplaySpeed: 4000,
        pauseOnHover: true,
        dots: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: false,
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2,
                    dots: false,
                    infinite: true,
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    dots: false,
                    infinite: true,
                }
            }
        ]
    };

    return (
        <div className="carousel_container">
            <div id="carousel">
                <Slider {...settings}>
                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.dale} loading="eager" alt="image no found" />
                            <p>Hero mask</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.jujutsu} loading="eager" alt="image no found" />
                            <p>Jujutsu Kaisen</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.slime} loading="eager" alt="image no found" />
                            <p>Jujutsu Kaisen</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.tatakae} loading="eager" alt="image no found" />
                            <p>Shingeki no Kyojin</p>
                        </a>
                    </div>
                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.dale} loading="eager" alt="image no found" />
                            <p>Hero mask</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.jujutsu} loading="eager" alt="image no found" />
                            <p>Jujutsu Kaisen</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.slime} loading="eager" alt="image no found" />
                            <p>Jujutsu Kaisen</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.tatakae} loading="eager" alt="image no found" />
                            <p>Shingeki no Kyojin</p>
                        </a>
                    </div>    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.dale} loading="eager" alt="image no found" />
                            <p>Hero mask</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.jujutsu} loading="eager" alt="image no found" />
                            <p>Jujutsu Kaisen</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.slime} loading="eager" alt="image no found" />
                            <p>Jujutsu Kaisen</p>
                        </a>
                    </div>

                    <div className="thumb">
                        <a className="thumbLink" href="">
                            <Image className="carousel_img" src={images.tatakae} loading="eager" alt="image no found" />
                            <p>Shingeki no Kyojin</p>
                        </a>
                    </div>




                </Slider>
            </div>
        </div>

    );
}

export default MultipleItems;



