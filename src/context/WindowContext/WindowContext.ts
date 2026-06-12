import { createContext, useContext } from "react";

export type WindowType =
  | "browser"
  | "camera"
  | "gallery"
  | "folder"
  | "news"
  | "preference"
  | "weather"
  | "calculator"
  | "notes"
  | "calendar"
  | "clock";

export interface WindowContextValues {
  openWindow: (window: WindowType) => void;
}

export const WindowContext = createContext<WindowContextValues>({
  openWindow: () => {},
});

export const useWindowContext = () => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error(
      "useWindowContext must be used within WindowContextProvider",
    );
  }
  return context;
};
