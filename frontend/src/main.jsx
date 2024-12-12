import {createRoot} from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import {createBrowserRouter, createRoutesFromElements, Route} from "react-router";
import {RouterProvider} from "react-router-dom";

const router = createBrowserRouter(createRoutesFromElements(<Route path="/" element={<App />} />));

createRoot(document.getElementById("root")).render(<RouterProvider router={router} />);
