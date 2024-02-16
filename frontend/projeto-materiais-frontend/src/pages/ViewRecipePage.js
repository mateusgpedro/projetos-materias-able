import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import {
  Box,
  CssBaseline,
  CssVarsProvider,
  Link,
  Sheet,
  Typography,
} from "@mui/joy";
import DashboardIcon from "@mui/icons-material/Dashboard";
import Header from "../components/Skus/Header";
import RecipeTable from "../components/Skus/RecipeTable";

export default function ViewRecipePage({ setIsLoggedIn }) {
  const [searchParams] = useSearchParams();
  const [recipe, setRecipe] = useState();

  const fetchRecipe = async () => {
    const skuCode = searchParams.get("c");
    const response = await axiosInstance.get(
      `/recipe/get_recipe?code=${skuCode}`
    );

    setRecipe(response.data);
  };

  useEffect(() => {
    const getRecipe = async () => {
      await fetchRecipe();
    };

    getRecipe();
  }, []);

  const path = recipe
    ? [
        <Link key="dashboard" href="/dashboard" color="neutral">
          <DashboardIcon fontSize="small" />
        </Link>,
        <Link key="sku" href="/skus" color="neutral">
          <Typography>Lista SKU's</Typography>
        </Link>,
        <Link key={recipe.skuId} href="#" color="neutral">
          <Typography>{recipe.skuName}</Typography>
        </Link>,
      ]
    : null;

  return (
    <Sheet sx={{ display: "flex", height: "100vh" }}>
      <Sidebar setIsLoggedIn={setIsLoggedIn} indexSelected={1}></Sidebar>
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
            <Header linkItems={path}></Header>
            <Box
              sx={{
                width: "100%",
                mt: 4,
                display: "flex",
                flexDirection: "row",
                justifyContent: "left",
                alignItems: "center",
              }}
            >
              <Typography
                level="h2"
                sx={{
                  color: "neutral.900",
                  margin: 0,
                }}
              >
                {`${recipe?.skuCode} - ${recipe?.skuName}`}
              </Typography>
            </Box>
            <RecipeTable recipe={recipe} />
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </Sheet>
  );
}
