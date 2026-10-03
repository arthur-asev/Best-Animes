'use client'; // 🛑 Essencial para usar hooks

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { setEpisode } from '../../../store/slices/episodeSlice';
import { setNameEpisode } from '../../../store/slices/episodeNameSlice';

export default function EpisodeButton({ episodeData, animeData, children }) {

    const router = useRouter();
    const dispatch = useDispatch();

    const handleClick = () => {

        dispatch(setEpisode(animeData));
        dispatch(setNameEpisode(episodeData));
        router.push(`/watchanime/${episodeData.id}`);
    };

    return (
        <button onClick={handleClick} className="w-full text-left px-3 m-2 py-1
         bg-indigo-600 text-white text-sm font-medium rounded-full
        hover:bg-indigo-500 transition cursor-pointer">
            {children}
        </button>
    );
}