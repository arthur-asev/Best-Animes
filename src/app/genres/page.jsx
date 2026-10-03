"use client";
import React, { useEffect, useState } from 'react';

import Navbar from '../../components/Nav'
import style from './style.module.css'
import Footer from '../../components/Footer'
import Image from 'next/image';
import Link from 'next/link';

export default function Genres() {

    const [genre, setGenres] = useState(null); // resultado da API
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        async function fetchGenres() {
            setLoading(true);
            try {
                const res = await fetch('http://localhost:3000/genreslist');
                const data = await res.json();

                setGenres(data);


            } catch (fetchError) {
                console.error("Erro ao fazer fetch:", fetchError);
            } finally {
                setLoading(false);
            }
        }
        fetchGenres();
    }, []);

    return (
        <>

            <Navbar />
            <div className={style.container}>
                <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 m-8'>
                    {genre && genre.map((card, index) => (
                        <div key={index} className="bg-indigo-800 p-4 rounded-md flex items-center flex-col shadow hover:scale-105 transition max-h-[620px]">
                            <Link className="thumbLink" href={`/genredetail/${card}`}>
                                <h3 className="text-lg text-center text-white font-semibold mt-2">{card}</h3>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
            <Footer />
        </>
    );
}

