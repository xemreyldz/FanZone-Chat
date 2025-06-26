import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface LoginState {
  username: string;
  password: string;
}

const initialState: LoginState = {
  username: "",
  password: "",
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginData: (state, action: PayloadAction<Partial<LoginState>>) => {
      Object.assign(state, action.payload);
    },
    resetLogin: () => initialState,
  },
});

export const { setLoginData, resetLogin } = loginSlice.actions;

export default loginSlice.reducer;
