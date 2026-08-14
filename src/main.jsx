import React from "react";
import { createRoot } from "react-dom/client";
import App from "./AppState";
import Modal from "react-modal";

const data = JSON.parse(document.getElementById("data").innerText);
Modal.setAppElement("#root");
createRoot(document.getElementById("root")).render(<App data={data} />);
