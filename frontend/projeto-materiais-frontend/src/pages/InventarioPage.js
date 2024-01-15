import { Box, CssBaseline, CssVarsProvider, Link, Typography } from "@mui/joy";
import Sidebar from "../components/Sidebar";
import Header from "../components/Skus/Header";
import DashboardIcon from "@mui/icons-material/Dashboard";

function InventarioPage({ setIsLoggedIn }) {
  const path = [
    <Link key="dashboard" href="/dashboard" color="neutral">
      <DashboardIcon fontSize="small" />
    </Link>,
    <Link key="inventario" href="" color="neutral">
      <Typography>Inventário</Typography>
    </Link>,
  ];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={4}></Sidebar>
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

export default InventarioPage;
