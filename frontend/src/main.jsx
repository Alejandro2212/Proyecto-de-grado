import { Buffer } from "buffer";
import process from "process";

// Polyfill for Buffer and process in the browser
window.Buffer = Buffer;
window.process = process;
window.global = window

import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';

import App from "./App";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>
);