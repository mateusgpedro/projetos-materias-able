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

export default function ListaMateriaisManutencao({ setIsLoggedIn }) {
  const path = [
    <Link key="dashboard" href="/dashboard" color="neutral">
      <DashboardIcon fontSize="small" />
    </Link>,
    <Link key="producao" href="" color="neutral">
      <Typography>Lista de materiais Manutenção</Typography>
    </Link>,
  ];

  return (
    <Sheet sx={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={3}></Sidebar>
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
                justifyContent: "left",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                level="h2"
                sx={{
                  color: "neutral.900",
                  margin: 0,
                }}
              >
                Lista de materiais Manutenção
              </Typography>
            </Box>
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </Sheet>
  );
}
