
"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

const Slider = dynamic(() => import("react-slick"), { ssr: false });


function MultipleItems() {

    const [anime, setAnime] = useState(null); // resultado da API
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchAnimes() {
            const res = await axios.get('/api/anime/top-airing');
            const data = await res.data;
            // console.log(data);
            setAnime(data);
        }
        fetchAnimes();
    },


        []);


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
    <div className="carousel_container  bg-gray-900 text-gray-100">
        {loading && <p>Carregando...</p>}
        <div id="carousel">
            {/* Adicionar a verificação condicional aqui: anime && anime.results */}
            {anime && anime.results && anime.results.length > 0 ? (
                <Slider {...settings}>
                    {anime.results.map((item) => ( // Troquei 'anime' por 'item' para evitar conflito de nome
                        <div key={item.id} className="thumb"> 
                            {/* ... seu código de renderização do item ... */}
                            <Link className="thumbLink" href={`/animedetail/${item.id}`}>
                                <Image
                                    width={300}
                                    height={100}
                                    loading='eager' 
                                    src={item.image} 
                                    alt={item.title} 
                                />
                                <p className="text-lg text-center text-white font-semibold mt-2">{item.title}</p>
                            </Link>
                        </div>
                    ))}
                </Slider>
            ) : (
                // Opcional: Mostrar algo se não houver dados
                !loading && <p>Nenhum anime encontrado.</p>
            )}
        </div>
    </div>
);
}

export default MultipleItems;



