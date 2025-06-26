import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface RegisterState {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  profileImage?: string;
  teamID?: string | number;
}

const initialState: RegisterState = {
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  password: "",
  profileImage: "",  // opsiyonel ama boş string ile başlayabilir
  teamID: undefined, // veya boş string, ya da hiç yazma
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setRegisterData: (state, action: PayloadAction<Partial<RegisterState>>) => {
      Object.assign(state, action.payload);
    },
    resetRegister: () => initialState,
  },
});



export const { setRegisterData, resetRegister } = registerSlice.actions;

export default registerSlice.reducer;
