import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const location = useLocation();

  return (
    <HelmetProvider>
      <AnimatePresence mode="wait">
        <AppRoutes key={location.pathname} />
      </AnimatePresence>
    </HelmetProvider>
  );
}

export default App;