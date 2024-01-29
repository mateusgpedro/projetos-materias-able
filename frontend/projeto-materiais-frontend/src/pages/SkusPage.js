import {
  Box,
  Button,
  CircularProgress,
  CssBaseline,
  CssVarsProvider,
  FormControl,
  FormLabel,
  Input,
  Link,
  Option,
  Select,
  Sheet,
  Typography,
} from "@mui/joy";
import Sidebar from "../components/Sidebar";
import Header from "../components/Skus/Header";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Filters from "../components/Filter";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import SkuTable from "../components/Skus/SkuTable";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import Pagination from "../components/Skus/Pagination";

function SkusPage({ setIsLoggedIn }) {
  const [isVeryfing, setIsVeryfing] = useState(true);
  const [skus, setSkus] = useState();
  const [pageCount, setPageCount] = useState();
  const [searchName, setSearchName] = useState("");
  const [linhas, setLinhas] = useState();
  const [searchLinha, setSearchLinha] = useState();

  async function handleFetchSkus(name, idLinha, page, pageSize) {
    try {
      const response = await axiosInstance.get(
        `/sku/get_skus?name=${name}&idLinha=${idLinha}&page=${page}&pageSize=${pageSize}`
      );

      const skusArray = Array.isArray(response.data.skuList)
        ? response.data.skuList
        : [response.data.skuList];

      const skusWithArrays = skusArray.map((sku) => ({
        ...sku,
        linhasNome: Array.isArray(sku.linhasNome)
          ? sku.linhasNome
          : [sku.linhasNome],
      }));

      setSkus(skusWithArrays);
      console.log("Skus state updated:", skusArray);

      setPageCount(response.data.pagesCount);
    } catch (error) {
      console.error("Error fetching skus:", error);
    }
  }

  async function fetchLinhas() {
    try {
      const response = await axiosInstance.get(`/linhas/get_linhas`);

      const linhasArray = Array.isArray(response.data)
        ? response.data
        : [response.data];

      setLinhas(linhasArray);
    } catch (error) {
      console.error("Error fetching linhas:", error);
    }
  }

  useEffect(() => {
    const getInitialInfo = async () => {
      await handleFetchSkus("", "", 1, 16);
      await fetchLinhas();
      setIsVeryfing(false);
    };

    getInitialInfo();
  }, []);

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
        onChange={(event) => {
          setSearchName(event.target.value);
        }}
        sx={{
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
      <Select
        onChange={(event, newValue) => {
          console.log(newValue);
          setSearchLinha(newValue);
        }}
        placeholder="Escolha o local de enchimento"
        sx={{
          minWidth: "15rem",
          color: "neutral",
        }}
        slotProps={{
          listbox: {
            sx: {
              width: "100%",
            },
          },
        }}
      >
        {linhas?.map((linha) => (
          <Option value={linha.id}>{linha.name}</Option>
        ))}
      </Select>
    </FormControl>,

    <Button
      type="submit"
      sx={{
        maxWidth: "32px",
        maxHeight: "32px",
        minWidth: "32px",
        minHeight: "32px",
      }}
    >
      <SearchOutlinedIcon fontSize="lg" />
    </Button>,
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
            <Header linkItems={path} />
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
            </Box>
            <Filters
              searchName={searchName}
              searchLinha={searchLinha}
              fetchSkus={handleFetchSkus}
              items={filters}
            />
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: "column",
              }}
            >
              {isVeryfing ? (
                <Sheet sx={{ margin: "auto" }}>
                  <CircularProgress />
                </Sheet>
              ) : (
                <SkuTable skus={skus} />
              )}
              <Pagination fetchSkus={handleFetchSkus} totalPages={pageCount} />
            </Box>
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </Sheet>
  );
}

export default SkusPage;
