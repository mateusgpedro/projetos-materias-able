import { Box, CssBaseline, CssVarsProvider, Link } from "@mui/joy";
import Sidebar from "../components/Sidebar";

function DashboardPage({ setIsLoggedIn }) {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={0}></Sidebar>
    </div>
  );
}

export default DashboardPage;
