import { Box, CssBaseline, CssVarsProvider, Typography, Link } from "@mui/joy";
import Sidebar from "../components/Sidebar";
import Header from "../components/Skus/Header";
import DashboardIcon from "@mui/icons-material/Dashboard";

function PlanoDeProducaoPage({ setIsLoggedIn }) {
  const path = [
    <Link key="dashboard" href="/dashboard" color="neutral">
      <DashboardIcon fontSize="small" />
    </Link>,
    <Link key="plano" href="" color="neutral">
      <Typography>Planos de Produção</Typography>
    </Link>,
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={3}></Sidebar>
      <CssVarsProvider>
        <CssBaseline>
          <Box
            sx={{
              px: 5,
              py: 3.5,
            }}
          >
            <Header linkItems={path}></Header>
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </div>
  );
}

export default PlanoDeProducaoPage;
