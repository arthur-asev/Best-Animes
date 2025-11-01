'use client'
import Nav from '../Nav'
import Footer from '../Footer'
import { useEffect, useState } from "react";



const Home = () => {

    const [title, setTitle] = useState(""); // valor digitado
    const [anime, setAnime] = useState(null); // resultado da API
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        // Evita buscar se o campo estiver vazio
        if (!title) return;

        const fetchAnime = async () => {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:5000/api/anime/${title}`);
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

        // console.log(anime.map(a => a.title));

        // debounce simples (espera 500ms depois de parar de digitar)
        const timeout = setTimeout(fetchAnime, 500);
        console.log(anime);
        return () => clearTimeout(timeout);


    }, [title]);

    return (
        <>


            <Nav/>
            <div className="lastEps"> Últimos episódios Lançados</div>

            <div style={{ padding: 20 }}>
                <h2>Pesquisar Anime</h2>

                <input
                    type="text"
                    placeholder="Digite o nome do anime..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ padding: 8, width: "100%", maxWidth: 300 }}
                />

                {loading && <p>Carregando...</p>}

                {!loading && anime && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {anime.data.map((anime) => (
                            <div key={anime.mal_id} className="bg-red-700 p-4 rounded-2xl shadow hover:scale-105 transition">
                                <img
                                    src={anime.images?.jpg?.image_url}
                                    alt={anime.title}
                                    className="w-full rounded-lg"
                                />
                                <h3 className="text-lg font-semibold mt-2">{anime.title}</h3>
                                <p className="text-sm text-gray-600 line-clamp-3 mt-1">
                                    {anime.synopsis || "Sem descrição"}
                                </p>
                                <a
                                    href={anime.url}
                                    target="_blank"
                                    className="text-blue-600 text-sm mt-2 inline-block"
                                >
                                    Ver mais →
                                </a>
                            </div>
                        ))}
                    </div>
                    // <div style={{ marginTop: 20 }}>
                    //     {anime.data.map(ani =>
                    //         <div key={ani.mal_id}>
                    //             <div className="cardEp">
                    //                 <a href="#">
                    //                     <div className="epLeg"><h4>Legendado</h4></div>
                    //                     <div className="epImg">
                    //                         <img src={ani.images.jpg.image_url} alt={ani.title} style={{ width: 200 }} />
                    //                     </div>
                    //                     <div className="epItemsInfos">
                    //                         <div className="epItemName">    <h4>{ani.title}</h4>
                    //                             <i className="fas fa-play icon-play"></i>
                    //                         </div>
                    //                     </div>
                    //                 </a>
                    //             </div>
                    //         </div>
                    //     )}
                    // </div>
                )}
            </div>



            {/* <div className='container flex-start'>

                <div className="epContainer">


                    <div className="cardEp">
                        <a href="#">
                            <div className="epLeg"><h4>Legendado</h4></div>
                            <div className="epImg">
                                <img src={epiImg} />
                            </div>
                            <div className="epItemsInfos">
                                <div className="epItemName">Shingeki no Kyojin- Episódio 16 HD
                                    <i className="fas fa-play icon-play"></i>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="cardEp">
                        <a href="#">
                            <div className="epLeg"><h4>Legendado</h4></div>
                            <div className="epImg">
                                <img src={ep1.yuru} />
                            </div>
                            <div className="epItemsInfos">
                                <div className="epItemName"> Yuru-Camp-2-Episódio-13
                                    <i className="fas fa-play icon-play"></i>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="cardEp">
                        <a href="#">
                            <div className="epLeg"><h4>Legendado</h4></div>
                            <div className="epImg">
                                <img src={ep1.one} />
                            </div>
                            <div className="epItemsInfos">
                                <div className="epItemName">  One-Piece-Episódio-967
                                    <i className="fas fa-play icon-play"></i>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="cardEp">
                        <a href="#">
                            <div className="epLeg"><h4>Legendado</h4></div>
                            <div className="epImg">
                                <img src={epiImg} />
                            </div>
                            <div className="epItemsInfos">
                                <div className="epItemName">Shingeki no Kyojin- Episódio 16 HD
                                    <i className="fas fa-play icon-play"></i>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="cardEp">
                        <a href="#">
                            <div className="epLeg"><h4>Legendado</h4></div>
                            <div className="epImg">
                                <img src={ep1.yuru} />
                            </div>
                            <div className="epItemsInfos">
                                <div className="epItemName"> Yuru-Camp-2-Episódio-13
                                    <i className="fas fa-play icon-play"></i>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="cardEp">
                        <a href="#">
                            <div className="epLeg"><h4>Legendado</h4></div>
                            <div className="epImg">
                                <img src={ep1.one} />
                            </div>
                            <div className="epItemsInfos">
                                <div className="epItemName">  One-Piece-Episódio-967
                                    <i className="fas fa-play icon-play"></i>
                                </div>
                            </div>
                        </a>
                    </div>






                </div>
            </div> */}
            <Footer />

        </>
    );
}
const styles = {
    container: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        background: "#f9fafb",
        minHeight: "100vh",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
    },
    input: {
        padding: "10px",
        width: "100%",
        maxWidth: "400px",
        margin: "0 auto 30px auto",
        display: "block",
        borderRadius: "8px",
        border: "1px solid #ccc",
        outline: "none",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "20px",
    },
    card: {
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        padding: "15px",
        transition: "transform 0.2s",
    },
    image: {
        width: "100%",
        borderRadius: "10px",
    },
    cardTitle: {
        fontSize: "1.1rem",
        marginTop: "10px",
    },
    text: {
        fontSize: "0.9rem",
        color: "#555",
    },
    link: {
        display: "inline-block",
        marginTop: "10px",
        color: "#007bff",
        textDecoration: "none",
    },
};
export default Home;
