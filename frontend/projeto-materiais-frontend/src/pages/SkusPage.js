import {
  Box,
  Button,
  CssBaseline,
  CssVarsProvider,
  FormControl,
  FormLabel,
  Input,
  Link,
  Sheet,
  Typography,
} from "@mui/joy";
import Sidebar from "../components/Sidebar";
import Header from "../components/Skus/Header";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Filters from "../components/Filter";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SelectMultiple from "../components/SelectMultiple";
import SkuTable from "../components/Skus/SkuTable";
import { useEffect } from "react";

function SkusPage({ setIsLoggedIn }) {
  useEffect(() => {});

  const path = [
    <Link key="dashboard" href="/dashboard" color="neutral">
      <DashboardIcon fontSize="small" />
    </Link>,
    <Link key="sku" href="#" color="neutral">
      <Typography>SKU's</Typography>
    </Link>,
  ];

  const filters = [
    <FormControl
      key="search"
      size="sm"
      sx={{
        flex: 2,
      }}
    >
      <FormLabel>Procurar SKU</FormLabel>
      <Input
        size="sm"
        startDecorator={<SearchOutlinedIcon fontSize="small" />}
        placeholder="Insira um nome ou código"
        sx={{
          color: "neutral.400",
          "--Input-minHeight": "32px",
          "--Input-radius": "8px",
          "--Input-paddingInline": "6px",
          "--Input-placeholderOpacity": 1,
        }}
      />
    </FormControl>,

    <FormControl
      key="localDeEnchimento"
      size="sm"
      sx={{
        flex: 1,
      }}
    >
      <FormLabel>Local de enchimento</FormLabel>
      <SelectMultiple />
    </FormControl>,
  ];

  return (
    <Sheet sx={{ display: "flex", height: "100vh", flexDirection: "row" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={1} />
      <CssVarsProvider>
        <CssBaseline>
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              px: 5,
              py: 3.5,
            }}
          >
            <Header linkItems={path}></Header>
            <Box
              sx={{
                width: "100%",
                mt: 4,
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                level="h1"
                sx={{
                  color: "neutral.900",
                  margin: 0,
                }}
              >
                SKU's
              </Typography>
              <Button
                size="sm"
                color="primary"
                sx={{
                  px: 4,
                  alignSelf: "flex-end",
                }}
              >
                Criar SKU
              </Button>
            </Box>
            <Filters items={filters} />
            <SkuTable />
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </Sheet>
  );
}

export default SkusPage;
