import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NumberContextApp } from "./NumberContextApp";
import "./globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <NumberContextApp />
  </StrictMode>,
);
