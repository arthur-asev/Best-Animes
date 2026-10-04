import axios from 'axios';
import Nav from '../../../components/Nav/index.jsx';
import Footer from '../../../components/Footer/index.jsx';


import EpisodeLoader from './EpisodeLoader.jsx'; // 🟢 Importa o novo Cliente Component
async function fetchAnimeEpisode(id) {
  // console.log(id);

  const backendUrl = process.env.BACKEND_URL || 'http://localhost:5000';
  const res = await axios.get(`${backendUrl}/api/anime/watch/${encodeURIComponent(id)}`);
  console.log(res);
  if (!res || res.status !== 200) {
    // Isso pode ser substituído por um `notFound()` do Next.js se o item não existir
    throw new Error('Falha ao buscar detalhes do anime');
  }

  return res.data;
}

export default async function WatchAnime({
  params
}: {
  params: { id: string }
}) {

  // 1. 🟢 CORREÇÃO DA SINTAXE: Use await para resolver o objeto params
  const actualParams = await params; // Resolve a Promise
  const { id } = actualParams;      // Desestrutura o objeto resolvido

  // 2. DEBUG CRÍTICO
  console.log(`ID recebido na URL: ${id}`);
  let animeEpisode;

  try {
    animeEpisode = await fetchAnimeEpisode(id);
  } catch (error) {
    console.error(error);
    return (
      <>
        <Nav />
        <div className='container p-8 mx-auto text-center'>
          <div style={{ maxWidth: "800px", margin: "40px auto" }}>
            <h1 className='text-red-500'>Vídeo Indisponível </h1>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const animeVideo = {
    headers: animeEpisode.headers,
    sources: animeEpisode?.sources || "",
    subtitles: animeEpisode?.subtitles || [],
  };

  const initialEpisodeData = { id: id, number: 0, title: "Episódio Carregado" };


  return (
    <>
      <Nav />
      <div className='min-h-screen flex justify-center align-middle pb-5 bg-gray-900 text-gray-100'>
        <EpisodeLoader
          animeVideo={animeVideo}
          initialEpisodeData={initialEpisodeData}
        />
      </div>

      <Footer />
    </>
  );
}
