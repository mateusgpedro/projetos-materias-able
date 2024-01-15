import Sidebar from "../components/Sidebar";
import Header from "../components/Skus/Header";
import { Box, CssBaseline, CssVarsProvider, Link, Typography } from "@mui/joy";
import DashboardIcon from "@mui/icons-material/Dashboard";

function ExistenciasPage({ setIsLoggedIn }) {
  const path = [
    <Link key="dashboard" href="/dashboard" color="neutral">
      <DashboardIcon fontSize="small" />
    </Link>,
    <Link key="existencias" href="" color="neutral">
      <Typography>Existências no armazém</Typography>
    </Link>,
  ];
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={2}></Sidebar>
      <CssVarsProvider>
        <CssBaseline>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
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

export default ExistenciasPage;
