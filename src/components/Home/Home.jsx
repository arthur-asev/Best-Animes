'use client'
import Nav from '../Nav'
import Footer from '../Footer'
import { useEffect, useState } from "react";
import Image from 'next/image';
import style from './style.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSearch } from "@fortawesome/free-solid-svg-icons";


const Home = () => {

    const [title, setTitle] = useState(""); // valor digitado
    const [anime, setAnime] = useState(null); // resultado da API
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchAnimes() {
            const res = await fetch('https://yumaapi.vercel.app/recent-episodes');
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
                const res = await fetch(`https://yumaapi.vercel.app/search/${title}`);
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

            <div className={style.container}>


                {/* <div className={style.lastEps}> Últimos episódios Lançados</div> */}

                <div className='container '>

                    <div className='flex justify-end shadow-[5px_20px_18px_#181515]  items-center '>

                        <div className=' flex p-2 items-center '>
                            <div className='m-2'>
                                <FontAwesomeIcon className='text-white' size='lg' icon={faSearch} />
                            </div>
                            <div>  <input
                                name='search'
                                type="text"
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
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-5 gap-8 ">
                            {anime.results.map((anime) => (
                                <div key={anime.id} className="bg-gray-700 p-4 flex flex-col shadow hover:scale-105 transition max-h-[620px]">
                                    <div className='flex justify-center max-w-[411px] max-h-[500px]'>
                                        <Image
                                            width={300}
                                            height={100}
                                            loading='eager'
                                            src={anime.image}
                                            alt={anime.title}
                                            className={`${style.epImg} `}
                                        />
                                    </div>

                                    <h3 className="text-lg text-center text-white font-semibold mt-2">{anime.title}</h3>
                                </div>
                            ))}
                            <div>
                                
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Home;
