import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from "@fortawesome/free-solid-svg-icons"; // Removido faUser não utilizado
import Footer from "../../../components/Footer";
import Nav from "../../../components/Nav";
import axios from 'axios';
import Link from 'next/link';
import { setEpisode } from '../../../store/slices/episodeSlice';
import EpisodeButton from './EpisodeButton';


// 1. Função para buscar os dados de um anime específico
async function   fetchAnimeDetail(id) {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
    const res = await axios.get(`${backendUrl}/api/anime/info/${encodeURIComponent(id)}`);
    console.log(res);
    return res.data;
}

// 2. Componente principal que recebe o `params`
// O nome do segmento dinâmico no App Router é o que está entre colchetes, no seu caso, [id]
export default async function AnimeDetail({
    params
}: {
    params: { id: string }
}) {



    // 3. Acessa o ID da URL. Não precisa de `await` aqui se for tipado como string.
    const actualParams = await params;
    const { id } = actualParams;



    let animeDetail;
    try {
        // 4. Busca os dados ANTES do render
        animeDetail = await fetchAnimeDetail(id);
        // console.log(animeDetail);

    } catch (error) {
        console.error(error);
        return (
            <>
                <Nav />
                <div className='container p-8 mx-auto text-center'>
                    <h1 className='text-2xl font-bold text-red-500'>Erro ao carregar os detalhes do anime.</h1>
                </div>
                <Footer />
            </>
        );
    }

    // 5. Estrutura de dados esperada: animeDetail.title, animeDetail.image
    const mockAnime = {
        title: animeDetail?.title || "Detalhes do Anime",
        image: animeDetail?.image || "https://placehold.co/400x600/1e293b/ffffff?text=Anime+Image",
        description: animeDetail?.description || "Descrição não disponível.",
        genres: animeDetail?.genres || ["Aventura", "Fantasia"],
        episodes: animeDetail?.episodes || ["Episódio 1", "Episódio 2", "Episódio 3"],
        status: animeDetail?.status || "Em Andamento"
    };


    // Para fins de demonstração, o bloco de busca anterior (que buscava episódios recentes/search)
    // foi substituído por uma seção de detalhes.

    return (
        <>
            <Nav />

            <div className='min-h-screen pb-5 bg-gray-900 text-gray-100 '>
                <div className='max-w-6xl mx-auto'>

                    {/* Barra de Pesquisa (Componente Cliente se fosse interativo, mas mantido para a estrutura) */}
                    <div className='flex justify-end mb-10'>
                        <div className='flex p-2 items-center bg-gray-800 rounded-lg shadow-xl'>
                            <div className='m-2'>
                                <FontAwesomeIcon className='text-white' size='lg' icon={faSearch} />
                            </div>
                            {/* NOTE: Input removido da interação por ser Server Component. Se precisar de interatividade, mova para um Client Component. */}
                            <input
                                name='search'
                                type="text"
                                placeholder="Digite o nome do anime..."
                                readOnly // Tornando somente leitura em Server Component
                                className="bg-gray-700 text-black p-2 rounded-md focus:outline-none"
                            />
                        </div>
                    </div>


                    <div className=''>
                        <div className='grid grid-flow-col grid-rows-1'>
                            {/* Imagem */}
                            <div className='w-50 md:w-1/3 flex justify-center'>
                                <img
                                    width={700}
                                    height={600}
                                    loading='eager'
                                    src={mockAnime.image}
                                    alt={mockAnime.title}
                                    className='rounded-lg shadow-xl object-cover w-50 h-auto max-w-xs md:max-w-50'

                                />
                            </div>



                            <div className='flex  md:flex-row gap-8 w-50'>
                                <div className='w-50'>
                                    <h1 className="text-4xl font-extrabold text-indigo-400 mb-4">{mockAnime.title}</h1>

                                    <div className="mb-4 text-sm text-gray-400">
                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${mockAnime.status === 'Concluído' ? 'bg-green-600' : 'bg-yellow-600'} text-white`}>
                                            {mockAnime.status}
                                        </span>
                                    </div>

                                    <p className="text-gray-300 leading-relaxed mb-6">{mockAnime.description}</p>

                                    <h2 className="text-xl font-semibold text-white mb-2">Gêneros</h2>
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {mockAnime.genres.map((genre, index) => (
                                            <span key={index} className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-500 transition cursor-default">
                                                {genre}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="border-t border-gray-700 pt-4">
                                        <p className="text-sm text-gray-500">ID na URL: <span className="font-mono text-indigo-400">{id}</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h2 className="text-3xl font-bold text-white mb-6 border-b border-indigo-700 pb-2">Episódios</h2>
                            {mockAnime.episodes.map((ep, index) => (
                                <div key={index} className="px-3 m-2 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full hover:bg-indigo-500 transition cursor-default">
                                    <EpisodeButton
                                        key={index}
                                        episodeData={ep} // 🛑 CORREÇÃO: Passa o episódio atual (ep)
                                        animeData={mockAnime} // 🛑 Passa o anime completo, se precisar dele no Redux
                                    >
                                        {/* O conteúdo do link (prop 'children') */}
                                        {ep.number}. {ep.title}{ep.isSubbed ? ' (Legendado)' : ''}
                                    </EpisodeButton>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold text-white mb-6 border-b border-indigo-700 pb-2">Outras Informações</h2>
                        {/* ... Conteúdo relacionado ... */}
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
