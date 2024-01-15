import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./CustomRoutes/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import { useEffect, useState } from "react";
import fetchValidation from "./utils/ValidateToken";
import LoginRoute from "./CustomRoutes/LoginRoute";
import SkusPage from "./pages/SkusPage";
import ExistenciasPage from "./pages/ExistenciasPage";
import PlanoDeProducaoPage from "./pages/PlanoDeProducaoPage";
import InventarioPage from "./pages/InventarioPage";
import DefinicoesPage from "./pages/DefinicoesPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      await fetchValidation({ setIsLoggedIn });
      setIsVerifying(false);
    };

    validateToken();
  }, []);

  if (!isVerifying) {
    return (
      <Router>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <DashboardPage setIsLoggedIn={setIsLoggedIn} />
              </PrivateRoute>
            }
          />
          <Route
            path="/skus"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <SkusPage setIsLoggedIn={setIsLoggedIn} />
              </PrivateRoute>
            }
          />
          <Route
            path="/existencias-armazem"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <ExistenciasPage setIsLoggedIn={setIsLoggedIn} />
              </PrivateRoute>
            }
          />
          <Route
            path="/planos-producao"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <PlanoDeProducaoPage setIsLoggedIn={setIsLoggedIn} />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventario"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <InventarioPage setIsLoggedIn={setIsLoggedIn} />
              </PrivateRoute>
            }
          />
          <Route
            path="/definicoes"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <DefinicoesPage setIsLoggedIn={setIsLoggedIn} />
              </PrivateRoute>
            }
          />
          <Route
            path="/login"
            element={
              <LoginRoute isLoggedIn={isLoggedIn}>
                <LoginPage setIsLoggedIn={setIsLoggedIn} />
              </LoginRoute>
            }
          />
        </Routes>
      </Router>
    );
  }
}

export default App;
