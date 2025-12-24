import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import { Toaster } from 'sonner';

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <Toaster position="bottom-left" />
    <App />
  </>
);
