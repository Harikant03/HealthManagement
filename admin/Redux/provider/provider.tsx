"use client";

import { Provider } from "react-redux";
import { store } from "../store/store";
import React from "react";
// react-cookie se provider import karein
import { CookiesProvider } from "react-cookie"; 
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store/store";

// --- Custom Hooks ---
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return (
    <CookiesProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </CookiesProvider>
  );
}