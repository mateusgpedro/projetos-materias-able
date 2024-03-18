import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
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
import { CriarPageProvider } from "./Contexts/CriarPageContext";
import * as signalR from "@microsoft/signalr";
import {
  Button,
  CssBaseline,
  CssVarsProvider,
  Snackbar,
  Typography,
} from "@mui/joy";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import axiosInstance from "./utils/axiosInstance";
import NotificationModel from "./Models/NotificationsModel";
import RoleProtectedRoute from "./CustomRoutes/RoleProtectedRoute";
import AprovarMaterial from "./pages/Materiais/AprovarMaterial";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { userRoles, setUserRoles, setNotificationsCount, setNotifications } =
    useAppContext();
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({
    message: "",
    Url: "",
    buttonMessage: "",
  });
  const [firstLoad, setFirstLoad] = useState(true);

  const NotificationSnackbar = () => {
    const navigate = useNavigate();
    return (
      <CssVarsProvider>
        <CssBaseline>
          <Snackbar
            autoHideDuration={5000}
            size="sm"
            open={notificationOpen}
            onClose={(event, reason) => {
              if (reason === "clickaway") {
                return;
              }
              setNotificationOpen(false);
            }}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            startDecorator={<NotificationsActiveOutlinedIcon fontSize="xl" />}
            endDecorator={
              <Button
                size="sm"
                variant="plain"
                color="neutral"
                onClick={() => {
                  navigate(notificationData.Url);
                }}
              >
                <Typography level="h6" fontSize="13px">
                  {notificationData.buttonMessage}
                </Typography>
              </Button>
            }
          >
            <Typography level="title-xs">{notificationData.message}</Typography>
          </Snackbar>
        </CssBaseline>
      </CssVarsProvider>
    );
  };

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get(
        "notifications/get_notifications"
      );

      setNotifications(
        response.data.map((notification) => {
          let dateTime = new Date(notification.dateTime);

          const timeDifference = Date.now() - dateTime.getTime();

          const minutes = Math.floor(timeDifference / (1000 * 60));
          const hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

          let timeDisplay;

          if (minutes < 60) {
            timeDisplay = `Há ${minutes} minutos atrás`;
          } else if (hours < 24) {
            timeDisplay = `Há ${hours} horas atrás`;
          } else {
            timeDisplay = `Há ${days} dias atrás`;
          }

          return new NotificationModel(
            notification.notificationTitle,
            notification.notificationMessage,
            notification.senderName,
            timeDisplay,
            notification.url
          );
        })
      );

      setNotificationsCount(response.data.length);
    } catch (e) {
      console.error("Failed to get notifications: ", e);
    }
  };

  const connectToSignalR = async () => {
    let conn = new signalR.HubConnectionBuilder()
      .withUrl(
        "http://beable-materiais-env.eba-peafr9cp.eu-west-3.elasticbeanstalk.com/ws/notification-hub",
        {
          accessTokenFactory: () => `${localStorage.getItem("jwt")}`,
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
        }
      )
      .build();

    conn.start();

    conn.on("ReceiveNotification", async (msg, url, btnMessage) => {
      setNotificationOpen(true);

      setNotificationData((prevState) => {
        const newNotification = {
          message: msg,
          Url: url,
          buttonMessage: btnMessage,
        };

        const updatedState = { ...prevState, ...newNotification };

        return updatedState;
      });

      await fetchNotifications();
    });
  };

  useEffect(() => {
    const initialize = async () => {
      await fetchValidation({ setIsLoggedIn, setUserRoles });
    };

    initialize();
  }, []);

  useEffect(() => {
    const afterLoginOperation = async () => {
      await fetchNotifications();
      await connectToSignalR();
    };

    if (isLoggedIn) {
      afterLoginOperation();
    }
    if (firstLoad) {
      setFirstLoad(false);
    } else {
      setIsVerifying(false);
    }
  }, [isLoggedIn]);

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
                  <NotificationSnackbar />
                </PrivateRoute>
              }
            />
            <Route
              path="/skus"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <SkusPage setIsLoggedIn={setIsLoggedIn} />
                  <NotificationSnackbar />
                </PrivateRoute>
              }
            />
            <Route
              path="/skus/recipe"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ViewRecipePage setIsLoggedIn={setIsLoggedIn} />
                  <NotificationSnackbar />
                </PrivateRoute>
              }
            />
            <Route
              path="materiais_manutencao"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ListaMateriaisManutencao setIsLoggedIn={setIsLoggedIn} />
                  <NotificationSnackbar />
                </PrivateRoute>
              }
            />
            <Route
              path="materiais_producao"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <ListaMateriaisProducao setIsLoggedIn={setIsLoggedIn} />
                  <NotificationSnackbar />
                </PrivateRoute>
              }
            />

            <Route
              path="materiais_producao/pedido"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <RoleProtectedRoute allowedRoles={["Chefia", "Dev", "Admin"]}>
                    <AprovarMaterial
                      setIsLoggedIn={setIsLoggedIn}
                      indexSelected={2}
                    />
                    <NotificationSnackbar />
                  </RoleProtectedRoute>
                </PrivateRoute>
              }
            />

            <Route
              path="materiais_manutencao/pedido"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <RoleProtectedRoute allowedRoles={["Chefia", "Dev", "Admin"]}>
                    <AprovarMaterial
                      setIsLoggedIn={setIsLoggedIn}
                      indexSelected={3}
                    />
                    <NotificationSnackbar />
                  </RoleProtectedRoute>
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
                    <NotificationSnackbar />
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
                    <NotificationSnackbar />
                  </CriarPageProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/definicoes"
              element={
                <PrivateRoute isLoggedIn={isLoggedIn}>
                  <DefinicoesPage setIsLoggedIn={setIsLoggedIn} />
                  <NotificationSnackbar />
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
