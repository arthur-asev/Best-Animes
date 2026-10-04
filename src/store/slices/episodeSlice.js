import { createSlice } from '@reduxjs/toolkit';

const episodeSlice = createSlice({
  name: 'episode',
  initialState: {
    selected: null,
  },
  reducers: {
    setEpisode: (state, action) => {
      state.selected = action.payload;
    },
    clearEpisode: (state) => {
      state.selected = null;
    },
  },
});

export const { setEpisode, clearEpisode } = episodeSlice.actions;
export default episodeSlice.reducer;
