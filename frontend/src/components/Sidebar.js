import {
    Badge,
    Box,
    CssBaseline,
    CssVarsProvider,
    Divider, Dropdown,
    GlobalStyles,
    IconButton,
    List, ListDivider,
    ListItem,
    ListItemButton,
    ListItemContent, Menu, MenuButton, MenuItem, MenuList,
    Sheet,
    Typography,
} from "@mui/joy";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import ViewListOutlinedIcon from "@mui/icons-material/ViewListOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate } from "react-router-dom";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import React, { useContext, useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import axiosInstance from "../utils/axiosInstance";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import SwapCallsOutlinedIcon from "@mui/icons-material/SwapCallsOutlined";
import { useSidebarContext } from "../Contexts/SidebarContext";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import {useAppContext} from "../Contexts/AppContext";

function ItemListaSidebar({
  indexSelected,
  index,
  page,
  name,
  icon,
  level = "title-sm",
}) {
  const navigate = useNavigate();
  return (
    <ListItem>
      <ListItemButton
        {...(indexSelected === index ? { selected: true } : null)}
        onClick={() => navigate(page)}
      >
        {icon}
        <Typography sx={{ fontSize: "0.8rem" }} level={level}>
          {name}
        </Typography>
      </ListItemButton>
    </ListItem>
  );
}

function NestedItemListaSidebar({ icon, name, children, setOpen, open }) {
  return (
    <ListItem nested>
      <ListItemButton onClick={() => setOpen(!open)}>
        {icon}
        <ListItemContent>
          <Typography sx={{ fontSize: "0.8rem" }} level="title-sm">
            {name}
          </Typography>
        </ListItemContent>
        <KeyboardArrowDownIcon
          sx={{ transform: open ? "rotate(180deg)" : "none" }}
        />
      </ListItemButton>
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: open ? "1fr" : "0fr",
          transition: "0.2s ease",
          "& > *": {
            overflow: "hidden",
          },
        }}
      >
        {children}
      </Box>
    </ListItem>
  );
}

function Sidebar({ indexSelected, setIsLoggedIn }) {
  const navigate = useNavigate();
  const {
    openLocasInstalacao,
    setOpenLocasInstalacao,
    openArmazens,
    setOpenArmazens,
    openFabrica,
    setOpenFabrica,
    openListaMateriais,
    setOpenListaMateriais,
    openMovimentosMateriais,
    setOpenMovimentosMateriais,
    openPlaneamentoMateriais,
    setOpenPlaneamentoMateriais,
    openInventario,
    setOpenInventario,
  } = useSidebarContext();

  const {
      notifications,
      notificationsCount
  } = useAppContext();

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
    <ItemListaSidebar
      indexSelected={indexSelected}
      index={0}
      page={"/dashboard"}
      name={"Dashboard"}
      icon={<DashboardOutlinedIcon />}
    />,

    <NestedItemListaSidebar
      setOpen={setOpenLocasInstalacao}
      open={openLocasInstalacao}
      icon={<AccountTreeOutlinedIcon />}
      name={"Locais de Instalação"}
    >
      <List sx={{ gap: 0.5, mt: 0.5 }}>
        <NestedItemListaSidebar
          setOpen={setOpenArmazens}
          open={openArmazens}
          name={"Armazéns"}
        ></NestedItemListaSidebar>
        <NestedItemListaSidebar
          setOpen={setOpenFabrica}
          open={openFabrica}
          name={"Fábrica"}
        ></NestedItemListaSidebar>
      </List>
    </NestedItemListaSidebar>,

    <NestedItemListaSidebar
      setOpen={setOpenListaMateriais}
      open={openListaMateriais}
      icon={<ViewListOutlinedIcon />}
      name={"Lista de Materiais"}
    >
      <List sx={{ gap: 0.5, mt: 0.5 }}>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={1}
          page={"/skus"}
          name={"Lista de SKU's"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={2}
          page={"/materiais_producao"}
          name={"Lista de materiais Produção"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={3}
          page={"/materiais_manutencao"}
          name={"Lista de materiais Manutenção"}
          level="body-sm"
        ></ItemListaSidebar>
      </List>
    </NestedItemListaSidebar>,

    <NestedItemListaSidebar
      setOpen={setOpenMovimentosMateriais}
      open={openMovimentosMateriais}
      icon={<SwapCallsOutlinedIcon />}
      name={"Movimentos de Materiais"}
    >
      <List sx={{ gap: 0.5, mt: 0.5 }}>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={4}
          name={"Recebimento de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={5}
          name={"Entrega de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={6}
          name={"Devolução de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={7}
          name={"Bloqueio de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={8}
          name={"Abate de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
      </List>
    </NestedItemListaSidebar>,

    <NestedItemListaSidebar
      setOpen={setOpenPlaneamentoMateriais}
      open={openPlaneamentoMateriais}
      icon={<CalendarMonthOutlinedIcon />}
      name={"Planeamento de Materiais"}
    >
      <List sx={{ gap: 0.5, mt: 0.5 }}>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={9}
          name={"Planear necessidade de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={10}
          name={"Mapa com planeamento de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={11}
          name={"Compra de materiais"}
          level="body-sm"
        ></ItemListaSidebar>
      </List>
    </NestedItemListaSidebar>,

    <NestedItemListaSidebar
      setOpen={setOpenInventario}
      open={openInventario}
      icon={<InventoryOutlinedIcon />}
      name={"Inventário"}
    >
      <List sx={{ gap: 0.5, mt: 0.5 }}>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={12}
          name={"Ficha de inventário"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={13}
          name={"Lançamento de contagens"}
          level="body-sm"
        ></ItemListaSidebar>
        <ItemListaSidebar
          indexSelected={indexSelected}
          index={14}
          name={"Acertos de inventário"}
          level="body-sm"
        ></ItemListaSidebar>
      </List>
    </NestedItemListaSidebar>,

    <ItemListaSidebar
      indexSelected={indexSelected}
      index={15}
      name={"Relatório"}
      level="title-sm"
      icon={<AssignmentOutlinedIcon />}
    ></ItemListaSidebar>,
  ];

  return (
    <CssVarsProvider>
      <CssBaseline>
        <Sheet
          sx={{
            height: "100dvh",
            overflow: "hidden auto",
            zIndex: 10000,
            display: "flex",
            flexDirection: "column",
            borderRight: "1px solid",
            borderColor: "divider",
            width: "var(--Sidebar-width)",
            margin: 0,
            position: "fixed",
            top: 0,
            bottom: 0,
            p: 2,
            flexShrink: 0,
          }}
        >
          <GlobalStyles
            styles={(theme) => ({
              ":root": {
                "--Sidebar-width": "270px",
              },
            })}
          />
          <Box sx={{display: "flex", flexDirection: "row", justifyContent: "space-between"}}>
              <Typography level="h2">LOGO</Typography>
              <Dropdown>
                  <MenuButton
                      slots={{ root: IconButton }}
                      slotProps={{ root: { variant: 'outlined', color: 'neutral' } }}
                      sx={{ maxWidth: "34px", minWidth: "34px", maxHeight: "34px", minHeight: "34px", alignSelf: "flex-end" }}
                  >
                      <Badge size="sm" badgeContent={notificationsCount} showZero={false}>
                          <NotificationsOutlinedIcon />
                      </Badge>
                  </MenuButton>
                      <Menu placement="right-start" sx={{ zIndex: 10001, minWidth: "280px", maxWidth: "330px", maxHeight: "500px", overflow: "auto" }}>
                          {notifications?.length === 0 && (
                              <MenuItem disabled>
                                  Não tem nenhuma notificação
                              </MenuItem>
                          )}
                          {notifications?.map((notification, index) => (
                              <Box key={index}>
                                  {index !== 0 && <ListDivider />}
                                  <MenuItem sx={{
                                      width: "100%"
                                  }} onClick={() => {
                                      navigate(notification.url)
                                  }}>
                                      <Box sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          width: "100%"
                                      }}>
                                          <Typography level="title-sm">{notification.title}</Typography>
                                          <Typography level="body-sm">{notification.message}</Typography>
                                          <Box sx={{ pt: 1.5, display: "flex", flexDirection: "row", justifyContent: "space-between" }}>
                                              <Typography sx={{ fontSize: "11px" }} level="body-sm">{notification.time}</Typography>
                                              <Typography sx={{ fontSize: "11px" }} level="title-sm">{notification.sender}</Typography>
                                          </Box>
                                      </Box>
                                  </MenuItem>
                              </Box>
                          ))}
                      </Menu>
              </Dropdown>
          </Box>
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
                "--List-nestedInsetStart": "30px",
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
              <ItemListaSidebar
                indexSelected={indexSelected}
                index={16}
                page={"/definicoes"}
                name={"Definições"}
                icon={<SettingsOutlinedIcon fontSize="small" />}
              />
            </List>
          </Box>
          <Divider />
          <Box sx={{ pt: 1.5, display: "flex", gap: 1, alignItems: "center" }}>
            <AccountCircleOutlinedIcon />
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography sx={{ fontSize: "0.8rem" }} level="title-sm">
                {sessionStorage.getItem("fullname")}
              </Typography>
              <Typography sx={{ fontSize: "0.6rem" }} level="body-xs">
                {sessionStorage.getItem("email")}
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
