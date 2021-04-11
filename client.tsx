import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "@layouts/App";

// import axios from "axios";
// axios.defaults.withCredentials = true;
// axios.defaults.baseURL = process.env.API_URL;

render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.querySelector("#app")
);
