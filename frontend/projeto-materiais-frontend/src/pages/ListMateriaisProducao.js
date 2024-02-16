import {
  Box,
  Button,
  CssBaseline,
  CssVarsProvider,
  Link,
  Sheet,
  Typography,
} from "@mui/joy";
import Sidebar from "../components/Sidebar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Header from "../components/Skus/Header";
import { useNavigate } from "react-router-dom";

export default function ListaMateriaisProducao({ setIsLoggedIn }) {
  const navigate = useNavigate();

  const path = [
    <Link key="dashboard" href="/dashboard" color="neutral">
      <DashboardIcon fontSize="small" />
    </Link>,
    <Link key="producao" href="" color="neutral">
      <Typography>Lista de materiais Produção</Typography>
    </Link>,
  ];

  return (
    <Sheet sx={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={2}></Sidebar>
      <CssVarsProvider>
        <CssBaseline>
          <Box
            sx={{
              ml: "var(--Sidebar-width)",
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              px: 5,
              py: 3.5,
            }}
          >
            <Header linkItems={path} />
            <Box
              sx={{
                width: "100%",
                mt: 4,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                level="h2"
                sx={{
                  color: "neutral.900",
                  margin: 0,
                }}
              >
                Lista de materiais Produção
              </Typography>
              <Box>
                <Button
                  onClick={() => navigate("criar_material")}
                  size="sm"
                  sx={{
                    maxHeight: "35px",
                    minHeight: "35px",
                  }}
                >
                  Criar novo material
                </Button>
              </Box>
            </Box>
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </Sheet>
  );
}
