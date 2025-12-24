import "./App.css";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import NewProject from "./pages/NewProject";
import Layout from "./layout/layout";
import About from "./pages/About";
import AppHeader from "./layout/app-header";
import EntryPoint from "./pages/EntryPoint";
import Projects from "./pages/Projects";
import Settings from "./pages/Settings";

function AnimatedRoutes() {
  const location = useLocation();
  const DEFAULT_ANIMATION_DURATION: number = 0.03;
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: DEFAULT_ANIMATION_DURATION }}
            >
              <EntryPoint />
            </motion.div>
          }
        /> 
        <Route
          path="/new-project"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: DEFAULT_ANIMATION_DURATION }}
            >
              <NewProject />
            </motion.div>
          }
        />
        <Route
          path="/projects"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: DEFAULT_ANIMATION_DURATION }}
            >
              <Projects />
            </motion.div>
          }
        /> 
        <Route
          path="/settings"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: DEFAULT_ANIMATION_DURATION }}
            >
             <Settings/> 
            </motion.div>
          }
        />   
        <Route
          path="/about"
          element={
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: DEFAULT_ANIMATION_DURATION }}
            >
              <About />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {

  return (
    <BrowserRouter>
      <AppHeader title="Sketch">
        <Layout>
          <AnimatedRoutes />
        </Layout>
      </AppHeader>
    </BrowserRouter>
  );
}

