import {Outlet} from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import {ToastContainer} from "react-toastify";
import "react-toastify/ReactToastify.css";
import Header from "./components/Header";

function App() {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <Header />
      <main className="py-3 scrollbar-custom">
        <Outlet />
      </main>
    </>
  );
}

export default App;
