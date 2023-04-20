import React from "react";
import "./styles/App.css";
import Auth from "./components/Auth";
import Movies from "./components/Movies";

const App = () => {
  return (
    <>
      <Auth />
      <Movies />
    </>
  );
};

export default App;
