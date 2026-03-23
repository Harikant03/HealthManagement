import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/authSlice";
import doctorReducer from "../slice/doctorSlice"; // Doctor slice ko import karein

export const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,// Yahan doctor reducer ko register karein
  },
});

// TypeScript Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;