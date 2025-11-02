
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import images from '../../assets/images/';
import Image from "next/image";

const Slider = dynamic(() => import("react-slick"), { ssr: false });


function MultipleItems() {

    const [anime, setAnime] = useState(null); // resultado da API
    const [loading, setLoading] = useState(false);

    console.log(anime);
    
    useEffect(() => {
        async function fetchAnimes() {
            const res = await fetch('https://yumaapi.vercel.app/top-airing');
            const data = await res.json();
            console.log(data);
            setAnime(data);
        }
        fetchAnimes();
    }, []);


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
            {/* {loading && <p>Carregando...</p>}
            <div id="carousel">
                <Slider {...settings}>
                    {anime.results.map((anime) => (

                        <div className="thumb">
                            <div key={anime.id} className="thumb">
                                <a className="thumbLink" href="">
                                    <Image
                                        width={300}
                                        height={100}
                                        loading='eager' src={anime.image} alt={anime.title} />
                                    <p className="text-lg text-center text-white font-semibold mt-2">{anime.title}</p>
                                </a>
                            </div>
                        </div>
                    ))}

                </Slider>
            </div> */}
        </div>
    );
}

export default MultipleItems;



