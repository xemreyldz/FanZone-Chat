
import {configureStore} from "@reduxjs/toolkit";

import registerReducer from "./slices/features/registerSlice"
import loginReducer from "./slices/features/loginSlice"


 export const store = configureStore({
    reducer:{
        // auth:authReducer,
            reg:registerReducer,
         log:loginReducer
    },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
