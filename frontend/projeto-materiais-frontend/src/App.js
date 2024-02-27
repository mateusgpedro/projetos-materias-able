import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./CustomRoutes/PrivateRoute";
import DashboardPage from "./pages/DashboardPage";
import { useEffect, useState } from "react";
import fetchValidation from "./utils/ValidateToken";
import LoginRoute from "./CustomRoutes/LoginRoute";
import SkusPage from "./pages/SkusPage";
import DefinicoesPage from "./pages/DefinicoesPage";
import { SidebarProvider } from "./Contexts/SidebarContext";
import ViewRecipePage from "./pages/ViewRecipePage";
import ListaMateriaisManutencao from "./pages/ListMateriaisManutencao";
import ListaMateriaisProducao from "./pages/ListMateriaisProducao";
import { useAppContext } from "./Contexts/AppContext";
import { CriarMaterialPage } from "./pages/Materiais/CriarMaterialPage.js";
import {CriarPageProvider} from "./Contexts/CriarPageContext";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { userRoles, setUserRoles } = useAppContext();

  useEffect(() => {
    const validateToken = async () => {
      await fetchValidation({ setIsLoggedIn, setUserRoles });
      setIsVerifying(false);
    };

    validateToken();
  }, [setIsLoggedIn, setUserRoles]);

  if (!isVerifying) {
    return (
      <Router>
        <SidebarProvider>
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
              path="/skus/recipe"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ViewRecipePage setIsLoggedIn={setIsLoggedIn} />
                </PrivateRoute>
              }
            />
            <Route
              path="materiais_manutencao"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ListaMateriaisManutencao setIsLoggedIn={setIsLoggedIn} />
                </PrivateRoute>
              }
            />
            <Route
              path="materiais_producao"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ListaMateriaisProducao setIsLoggedIn={setIsLoggedIn} />
                </PrivateRoute>
              }
            />

              <Route
                  path="materiais_producao/criar_material/*"
                  element={
                      <PrivateRoute isLoggedIn={isLoggedIn}>
                          <CriarPageProvider page={"materiais_producao"}>
                              <CriarMaterialPage
                                  indexSelected={2}
                                  setIsLoggedIn={setIsLoggedIn}
                              />
                          </CriarPageProvider>
                      </PrivateRoute>
                  }
              />
              <Route
                  path="materiais_manutencao/criar_material/*"
                  element={
                      <PrivateRoute isLoggedIn={isLoggedIn}>
                          <CriarPageProvider page={"materiais_manutencao"}>
                              <CriarMaterialPage
                                  indexSelected={3}
                                  setIsLoggedIn={setIsLoggedIn}
                              />
                          </CriarPageProvider>
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
        </SidebarProvider>
      </Router>
    );
  }
}

export default App;
