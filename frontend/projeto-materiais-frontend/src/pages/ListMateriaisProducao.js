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
import MaterialsTable from "../components/materials/MaterialsTable";
import {useEffect, useState} from "react";
import axiosInstance from "../utils/axiosInstance";
import Pagination from "../components/Skus/Pagination";

export default function ListaMateriaisProducao({ setIsLoggedIn }) {
    const [materials, setMaterials] = useState();
    const [canLoad, setCanLoad] = useState(false);
    const [totalPages, setTotalPages] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    const navigate = useNavigate();

      const fetchMaterials = async (page, pageSize) => {
          try {
              const response = await axiosInstance.get(
                  `materials/search_materials?searchString=&searchType=-1&materialType=producao&page=${page}&pageSize=${pageSize}`);

              const materialsArray = Array.isArray(response.data.materialDtos) ? response.data.materialDtos : [response.data.materialDtos];

              const materialsWithArrays = materialsArray.map((material) => ({
                  ...material,
                  manufacturers: Array.isArray(material.manufacturers)
                      ? material.manufacturers
                      : [material.manufacturers]
              }));

              setTotalPages(response.data.totalPages)
              setMaterials(materialsWithArrays);
          } catch (e) {
              console.error("Error Fetching materials: ", e);
          }
      }

    useEffect(() => {
        const getMaterials = async () => {
            await fetchMaterials(1, 16);
            setCanLoad(true);
        }

        getMaterials()
    }, []);


      const path = [
        <Link key="dashboard" href="/dashboard" color="neutral">
          <DashboardIcon fontSize="small" />
        </Link>,
        <Link key="producao" href="" color="neutral">
          <Typography>Lista de materiais Produção</Typography>
        </Link>,
      ];

      if (canLoad) {
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
                          onClick={() => navigate("criar_material/confirmar")}
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
                      <MaterialsTable materials={materials}/>
                      <Pagination
                          totalPages={totalPages}
                          setCurrentPage={setCurrentPage}
                          currentPage={currentPage}
                          fetchData={fetchMaterials}
                      />
                  </Box>
                </CssBaseline>
              </CssVarsProvider>
            </Sheet>
          );
      }
}
