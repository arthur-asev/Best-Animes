'use client'
import Nav from '../Nav'
import Footer from '../Footer'
import { useEffect, useState } from "react";
import Image from 'next/image';
import style from './style.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';


const Home = () => {

    const [title, setTitle] = useState(""); // valor digitado
    const [anime, setAnime] = useState(null); // resultado da API
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchAnimes() {
            const res = await fetch('/api/anime/recent-episodes');
            const data = await res.json();
            console.log(data);

            setAnime(data);
        }
        fetchAnimes();
    }, []);



    useEffect(() => {
        // Evita buscar se o campo estiver vazio
        if (!title) return;

        const fetchAnime = async () => {
            try {
                setLoading(true);
                const res = await fetch(`/api/anime/search?q=${encodeURIComponent(title)}`);
                const data = await res.json();
                setAnime(data);
                console.log(data);

                console.log(typeof (anime));

            } catch (err) {
                console.error("Erro ao buscar anime:", err);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchAnime, 500);
        return () => clearTimeout(timeout);


    }, [title]);

    return (
        <>
            <Nav />

            {/* <div className={style.lastEps}> Últimos episódios Lançados</div> */}

            <div className='min-h-screen  bg-gray-900 pb-5 text-gray-100'>
                <div className='container mx-auto '>
                    <div className='flex justify-end shadow-[5px_20px_18px_#181515]  items-center '>

                        <div className=' flex p-2 items-center '>
                            <div className='m-2'>
                                <FontAwesomeIcon className='text-white' size='lg' icon={faSearch} />
                            </div>
                            <div>  <input
                                name='search'
                                type="text"
                                className="text-black p-2 rounded-md focus:outline-none"
                                placeholder="Digite o nome do anime..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                style={{ padding: 8, width: "100%", maxWidth: 300 }}
                            /></div>
                        </div>
                    </div>
                    <div className='shadow-xl mb-10'>

                    </div>
                    {loading && <p>Carregando...</p>}

                    {!loading && anime && (
                        <div className="grid sm:grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-5 ">
                            {anime.results.map((card) => (
                                <div key={card.id} className="bg-indigo-800 p-4 rounded-md flex items-center flex-col shadow hover:scale-105 transition max-h-[620px]">
                                    <Link className="thumbLink" href={`/animedetail/${card.id}`}>
                                        <Image
                                            width={300}
                                            height={100}
                                            loading='eager'
                                            src={card.image}
                                            alt={card.title}
                                            className={`${style.epImg} `}
                                        />

                                        <h3 className="text-lg text-center text-white font-semibold mt-2">{card.title}</h3>
                                    </Link>
                                </div>
                            ))}

                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Home;
