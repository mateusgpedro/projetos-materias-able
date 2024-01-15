import {
  Box,
  CssBaseline,
  CssVarsProvider,
  Divider,
  GlobalStyles,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemContent,
  Sheet,
  Typography,
} from "@mui/joy";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import React from "react";
import axiosInstance from "../utils/axiosInstance";

function ItemListaSidebar(indexSelected, index, page, nome, icon) {
  const navigate = useNavigate();
  return (
    <ListItem>
      <ListItemButton
        {...(indexSelected === index ? { selected: true } : null)}
        onClick={() => (indexSelected !== index ? navigate(page) : null)}
      >
        {icon}
        <Typography sx={{ fontSize: "0.8rem" }} level="title-sm">
          {nome}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}

function Sidebar({ indexSelected, setIsLoggedIn }) {
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      const response = await axiosInstance.post(
        "/auth/logout",
        {},
        {
          withCredentials: true,
        }
      );

      localStorage.removeItem("jwt");
      setIsLoggedIn(false);
      navigate("/login");
    } catch (error) {
      console.error("Failed to logout: ", error);
    }
  }

  const itemList = [
    ItemListaSidebar(
      indexSelected,
      0,
      "/dashboard",
      "Dashboard",
      <DashboardOutlinedIcon />
    ),
    ItemListaSidebar(
      indexSelected,
      1,
      "/skus",
      "SKU's",
      <ViewListOutlinedIcon />
    ),
    ItemListaSidebar(
      indexSelected,
      2,
      "/existencias-armazem",
      "Existências no armazém",
      <Inventory2OutlinedIcon />
    ),
    ItemListaSidebar(
      indexSelected,
      3,
      "/planos-producao",
      "Planos de Produção",
      <CalendarMonthOutlinedIcon />
    ),
    ItemListaSidebar(
      indexSelected,
      4,
      "/inventario",
      "Inventário",
      <InventoryOutlinedIcon />
    ),
  ];

  return (
    <CssVarsProvider>
      <CssBaseline>
        <Sheet
          sx={{
            overflow: "hidden",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid",
            borderColor: "divider",
            width: "var(--Sidebar-width)",
            margin: 0,
            p: 2,
            flexShrink: 0,
          }}
        >
          <GlobalStyles
            styles={(theme) => ({
              ":root": {
                "--Sidebar-width": "240px",
                // [theme.breakpoints.up("lg")]: {
                //   "--Sidebar-width": "240px",
                // },
              },
            })}
          />
          <Typography level="h2">LOGO</Typography>
          <Box
            sx={{
              pt: 3,
              overflow: "hidden auto",
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              gap: 1.5,
            }}
          >
            <List
              size="sm"
              sx={{
                gap: 1,
                "--ListItem-radius": (theme) => theme.vars.radius.sm,
              }}
            >
              {itemList.map((item, index) => (
                <React.Fragment key={index}>{item}</React.Fragment>
              ))}
            </List>
            <List
              sx={{
                flexDirection: "column-reverse",
                "--ListItem-radius": (theme) => theme.vars.radius.sm,
              }}
            >
              {ItemListaSidebar(
                indexSelected,
                5,
                "/definicoes",
                "Definições",
                <SettingsOutlinedIcon fontSize="small" />
              )}
            </List>
          </Box>
          <Divider />
          <Box sx={{ pt: 1.5, display: "flex", gap: 1, alignItems: "center" }}>
            <AccountCircleOutlinedIcon />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: "0.8rem" }} level="title-sm">
                Mateus Pedro
              </Typography>
              <Typography sx={{ fontSize: "0.6rem" }} level="body-xs">
                mateusgpedro.6@gmail.com
              </Typography>
            </Box>
            <IconButton size="sm" onMouseDown={handleLogout}>
              <LogoutOutlinedIcon fontSize="small" />
            </IconButton>
          </Box>
        </Sheet>
      </CssBaseline>
    </CssVarsProvider>
  );
}

export default Sidebar;
