import { createSlice } from '@reduxjs/toolkit';

const episodeNameSlice = createSlice({
  name: 'episodeName',
  initialState: {
    selected: null,
  },
  reducers: {
    setNameEpisode: (state, action) => {
      state.selected = action.payload;
    },
    clearNameEpisode: (state) => {
      state.selected = null;
    },
  },
});

export const { setNameEpisode, clearNameEpisode } = episodeNameSlice.actions;
export default episodeNameSlice.reducer;
