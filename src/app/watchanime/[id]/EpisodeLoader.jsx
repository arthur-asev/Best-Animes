// app/watchanime/[id]/EpisodeLoader.jsx
'use client'; 

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // Use 'next/navigation' no App Router!
// import VideoPlayer from '../../../components/VideoPlayer/page.jsx'; // Ou o componente de player real
import VideoJSPlayer from '../../../components/VideoJSPlayer/videojs-player.jsx';
// Este componente recebe os dados do vídeo que o Servidor buscou
export default function EpisodeLoader({ animeVideo, initialEpisodeData }) {
 
    // 1. Hooks do Cliente
    const router = useRouter();
    // 2. Acessa o estado do Redux para ver o episódio selecionado
    const selectedEpisode = useSelector((state) => state.episode.selected);
    const selectedEpisodeDetails = useSelector((state) => state.episodename.selected);
    // 3. Usa o `initialEpisodeData` (vindo do servidor) como fallback, mas verifica o Redux para redirecionar.
    const episode = selectedEpisode || initialEpisodeData;

    // 4. Lógica de Redirecionamento (só roda no cliente)
    useEffect(() => {
        // Se não houver dados de episódio no Redux ou inicial, redireciona.
        if (!episode) {
            // Se o ID da URL não for o suficiente para o Server Component, redireciona.
            // Para ser robusto, idealmente o Server Component já deveria ter encontrado o ID.
            // Aqui, apenas verificamos o estado após a montagem.
            router.push('/');
        }
    }, [episode, router]);

    // Exibe carregando (Embora o Server Component já tenha renderizado o layout)
    if (!episode) return <p className="text-white text-center p-8">Redirecionando...</p>;


    // 5. Renderização do player (Usando os dados buscados pelo Server Component)
    return (
        <div style={{ maxWidth: "800px",width:"800px"}}>
            <h1 className='mt-5'>{selectedEpisodeDetails.number}. {selectedEpisodeDetails.title}</h1>
            <VideoJSPlayer dataVideo={animeVideo}/>
        </div>
    );
}