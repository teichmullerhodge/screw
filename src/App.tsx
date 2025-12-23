import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import NewProject from "./pages/NewProject";
import Layout from "./layout/layout";
import About from "./pages/About";
import AppHeader from "./layout/app-header";

export default function App() {

  return (
  <BrowserRouter>
  <AppHeader title="Sketch">
    <Layout>
      <Routes>
        <Route path="/new-project" element={<NewProject/>}/>
        <Route path="/about" element={<About/>}/>
      </Routes>
    </Layout>
    </AppHeader>
  </BrowserRouter>
  )
}
