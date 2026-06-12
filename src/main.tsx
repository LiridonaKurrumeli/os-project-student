import React from "react";
import { createRoot } from "react-dom/client";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";

import { AuthContextProvider } from "@context/AuthContext/AuthContextProvider";
import { WindowContextProvider } from "@context/WindowContext/WindowContextProvider";

import "./styles/index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <WindowContextProvider>
          <App />
        </WindowContextProvider>
      </AuthContextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
