import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import App from "./App";
import store, { persistor } from "./features/store";
import "./lang/i18n";
import { SocketContext, socket } from "./context/sockets";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketContext.Provider value={socket}>
        <App />
      </SocketContext.Provider>
    </PersistGate>
  </Provider>
);
