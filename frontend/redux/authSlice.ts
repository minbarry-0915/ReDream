import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthState {
  user: null | {id: string; name: string};
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{user: {id: string; name: string}; token: string}>,
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: state => {
      state.user = null;
      state.token = null;
    },
  },
});

export const {login, logout} = authSlice.actions;
export default authSlice.reducer;
