import React from "react";
import ReactDOM from "react-dom";
import App from "./AppState";
import * as serviceWorker from "./serviceWorker";
import Modal from "react-modal";

const data = JSON.parse(document.getElementById("data").innerText);
Modal.setAppElement("#root");
ReactDOM.render(<App data={data} />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
