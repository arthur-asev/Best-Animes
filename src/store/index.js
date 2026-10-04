'use client';
import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { 
    persistStore, 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import episodeReducer from './slices/episodeSlice';
import episodeNameReducer from './slices/episodeNameSlice';

const persistConfig = {
    key: 'root', // Chave principal para o localStorage
    version: 1,
    storage, // Usa o LocalStorage
    whitelist: ['episode','episodename'] // 🛑 ARRAY de slices que você QUER persistir (apenas o 'episode' neste caso)
    // blacklist: [], // Slices que você NÃO QUER persistir
};

// 2. Combine seus reducers (necessário para o persist)
const rootReducer = combineReducers({
    episode: episodeReducer,
    episodename: episodeNameReducer,
    // adicione outros slices aqui
});


// 3. Crie o Reducer Persistido
const persistedReducer = persistReducer(persistConfig, rootReducer);

// 4. Crie o Store (com middlewares para ignorar ações do persist)
export const store = configureStore({
    reducer: persistedReducer, // Use o reducer persistido
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

// 5. Crie o Persistor (objeto necessário para envolver a aplicação)
export const persistor = persistStore(store);



// export const store = configureStore({
//   reducer: {
//     episode: episodeReducer,
//     episodename:episodeNameReducer,
//   },
// });
