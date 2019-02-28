import React from "react";
import ReactDOM from "react-dom";
import App from "./AppState";
import * as serviceWorker from "./serviceWorker";
import Modal from "react-modal";

const data = JSON.parse(document.getElementById("data").innerText);
Modal.setAppElement("#root");
ReactDOM.render(<App data={data} />, document.getElementById("root"));
serviceWorker.unregister();
