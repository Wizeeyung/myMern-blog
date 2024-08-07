import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: localStorage.getItem('theme') || 'dark'
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark' ;
      // state.theme = state.theme === 'dark' ? 'light' : 'dark' ;
      localStorage.setItem('theme', state.theme);
    }
  }
});

export const {toggleTheme} = themeSlice.actions;

export default themeSlice.reducer;