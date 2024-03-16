import {
  Box,
  Button,
  Checkbox,
  CssBaseline,
  CssVarsProvider,
  Divider,
  FormControl,
  FormHelperText,
  FormLabel,
  GlobalStyles,
  IconButton,
  Input,
  ListDivider,
  Option,
  Select,
  Sheet,
  Snackbar,
  Step,
  StepButton,
  StepIndicator,
  Stepper,
  Typography,
} from "@mui/joy";
import Sidebar from "../../components/Sidebar";
import React, {useCallback, useEffect, useState} from "react";
import {Navigate, useLocation, useNavigate, useSearchParams} from "react-router-dom";
import Check from "@mui/icons-material/Check";
import CheckBoxImage from "../../imgs/Checking boxes-rafiki.png";
import axiosInstance from "../../utils/axiosInstance";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EmptyBoxImage from "../../imgs/Empty-rafiki.png";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LookForBoxImage from "../../imgs/Checking boxes-bro.png";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {useCriarPageContext} from "../../Contexts/CriarPageContext";
import {FormularioCriarMaterial} from "./FormularioCriarMaterial";

export const steps =
    [
      {
        stepText: "Confirmar existência",
        pageName: "confirmar",
        activeStep: 0,
      },
      {
        stepText: "Criar Material",
        pageName: "criar",
        activeStep: 1,
      },
      {
        stepText: "Concluído",
        pageName: "concluido",
        activeStep: 2,
      }
    ];

function getMaterialTypeUrl() {
  const currentPathname = window.location.pathname;

  const parts = currentPathname.split("/");
  const materialType = parts[parts.length - 3];

  return materialType;
}

function CustomInputField({ setSearchString, searchType, setSearchType }) {
  return (
    <Input
      sx={{ width: "100%" }}
      onChange={(event) => {
        setSearchString(event.target.value);
      }}
      placeholder={`Insira ${
        searchType === "description"
          ? "a descrição"
          : searchType === "manufacturer code"
          ? "o código de fabricante"
          : ""
      }`}
      endDecorator={
        <React.Fragment>
          <Divider orientation="vertical" />
          <Select
            size="sm"
            value={searchType}
            variant="plain"
            onChange={(_, value) => setSearchType(value)}
            slotProps={{
              listbox: {
                variant: "outlined",
              },
            }}
            sx={{ mr: -1.5, "&:hover": { bgcolor: "transparent" } }}
          >
            <Option value="description">Descrição</Option>
            <Option value="manufacturer code">Código Fabricante</Option>
          </Select>
        </React.Fragment>
      }
    />
  );
}

function AlreadySearchedMaterial({
  setSearchString,
  searchType,
  setSearchType,
  searchedMaterials,
  handleSearchMaterials,
  handleNextPage,
  allowedSteps,
}) {
  const [confirmed, setConfirmed] = useState();
  function SearchedItem({
    description,
    index,
    unities,
    manufacturerCode,
    cost,
  }) {
    return (
      <Box
        key={index}
        sx={{
          py: 1,
          gap: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {index !== 0 && <Divider />}
        <Typography level="title-md">{description}</Typography>
        {/* <Typography level="title-sm">
          Código fabricante:{" "}
          <Typography level="body-sm">{manufacturerCode}</Typography>
        </Typography> */}
      </Box>
    );
  }

  return (
    <Box
      sx={{ display: "flex", flexDirection: "column", mt: 3, height: "100%" }}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSearchMaterials();
          return false;
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
          }}
        >
          <CustomInputField
            setSearchString={setSearchString}
            setSearchType={setSearchType}
            searchType={searchType}
          />
          <Button type="submit" sx={{ maxWidth: "36px", minWidth: "36px" }}>
            <SearchOutlinedIcon />
          </Button>
        </Box>
      </form>
      <Box sx={{ mt: 3, gap: 2 }}>
        {searchedMaterials.length !== 0 ? (
          searchedMaterials.map((material, index) => (
            <SearchedItem
              description={material.name}
              unities={material.unities}
              index={index}
              manufacturerCode={material.manufacturerCode}
              cost={material.cost}
            />
          ))
        ) : (
          <Box
            sx={{
              mt: 5,
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            <img style={{ width: "30%", height: "auto" }} src={EmptyBoxImage} />
            <Typography level="h2">Nenhum material encontrado!</Typography>
          </Box>
        )}
      </Box>
      <Box
        sx={{
          mt: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "left",
        }}
      >
        <Checkbox
          size="sm"
          label="Confirmo que o material que pretendo criar não existe."
          sx={{ color: "neutral", right: 0 }}
          checked={confirmed}
          onChange={(e) => setConfirmed(e.target.checked)}
        />
        <Button
          size="sm"
          sx={{
            justifyContent: "flex-start",
            width: "auto",
            alignSelf: "flex-start",
          }}
          disabled={confirmed ? false : true}
          onClick={() => {
            handleNextPage();
          }}
        >
          Continuar
        </Button>
      </Box>
    </Box>
  );
}

export function getMaterialType() {
  const currentPathname = window.location.pathname;

  const parts = currentPathname.split("/");
  const materialType = parts[parts.length - 3];

  return materialType === "materiais_producao" ? "producao" : "manutencao";
}

function ConfirmarExistencia({
    setAllowedSteps,
    allowedSteps,
    setInfoSnackbarOpen,
    navigate,
    setActiveStep
}) {
  const [searchType, setSearchType] = useState("description");
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [searchedMaterials, setSearchMaterials] = useState([]);
  const [switchPage, setSwitchPage] = useState(false);

  const {materialTypePage, setMaterialTypePage} = useCriarPageContext();

  const handleSearchMaterials = async () => {
    const materialType = getMaterialType();
    try {
      const response = await axiosInstance.get(
        `materials/search_materials?searchString=${searchString}&searchType=${
          searchType === "description"
            ? 0
            : searchType === "manufacturer code"
            ? 1
            : -1
        }&materialType=${materialType}&page=1&pageSize=0`
      );

      const materialsArray = Array.isArray(response.data.materialDtos) ? response.data.materialDtos : [response.data.materialDtos];
      setSearchMaterials(materialsArray);


      if (materialsArray.length === 0) {
        setSuccessSnackbarOpen(true);
        setAllowedSteps(switchPage ? 1 : 2);
      } else {
        setInfoSnackbarOpen(true);
        setAllowedSteps(1);
        switchPage === false ? setSwitchPage(true) : setSwitchPage(true);
      }
    } catch (e) {}
  };

  const handleNextPage = async () => {
    navigate(`/${materialTypePage}/criar_material/criar`)
    setActiveStep(1);
  };

  if (!switchPage) {
    return (
      <Box
        sx={{
          gap: 3,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          m: "auto",
          width: "35%",
        }}
      >
        <Typography width="800px" textAlign="center" level="h1">
          Verifique se o material já existe
        </Typography>
        <form
          style={{ width: "100%" }}
          onSubmit={(event) => {
            event.preventDefault();
            handleSearchMaterials();
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
            }}
          >
            <CustomInputField
              setSearchString={setSearchString}
              setSearchType={setSearchType}
              searchType={searchType}
            />
            <Button type="submit" sx={{ maxWidth: "36px", minWidth: "36px" }}>
              <SearchOutlinedIcon />
            </Button>
          </Box>
        </form>
        <img style={{ width: "80%", height: "auto" }} src={LookForBoxImage} />
        <Button
          disabled={2 > allowedSteps}
          onClick={() => {
            handleNextPage();
          }}
        >
          Continuar
        </Button>
        <Snackbar
          autoHideDuration={6000}
          open={successSnackbarOpen}
          variant="soft"
          color="success"
          onClose={(event, reason) => {
            if (reason === "clickaway") {
              return;
            }
            setSuccessSnackbarOpen(false);
          }}
          endDecorator={
            <Button
              onClick={() => {
                setSuccessSnackbarOpen(false);
                handleNextPage();
              }}
              size="sm"
              variant="soft"
              color="success"
            >
              Continuar
            </Button>
          }
        >
          Nenhum material foi encontrado!
        </Snackbar>
      </Box>
    );
  } else {
    return (
      <AlreadySearchedMaterial
        allowedSteps={allowedSteps}
        handleNextPage={handleNextPage}
        handleSearchMaterials={handleSearchMaterials}
        searchedMaterials={searchedMaterials}
        setSearchString={setSearchString}
        setSearchType={setSearchType}
        searchType={searchType}
      />
    );
  }
}

function MaterialCreationDone() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        m: "auto",
      }}
    >
      <Typography level="h2">
        O pedido de cadastramento do material foi realizado com sucesso!
      </Typography>
      <Typography level="title-md">
        O material foi enviado à chefia para aprovação.
      </Typography>
      <img style={{ width: "30%", height: "auto" }} src={CheckBoxImage} />
      <Button
        onClick={() => {
          navigate("/materiais_producao");
        }}
      >
        Concluído
      </Button>
    </Box>
  );
}



export function CriarMaterialPage({ isLoggedIn, indexSelected }) {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [allowedSteps, setAllowedSteps] = useState(1);
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);
  const {materialTypePage, setMaterialTypePage} = useCriarPageContext();

  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentPage = () => {
    const currentPathname = location.pathname;
    const parts = currentPathname.split("/");
    const currentPage = parts[parts.length - 1];
    return currentPage;
  }

  const canEnterPage = (activeStepToSet) => {
    if (activeStepToSet > allowedSteps - 1) {
      setActiveStep(0);
      navigate("confirmar")
    } else {
      setActiveStep(activeStepToSet);
    }
  }
  
  useEffect(() => {
    const currentPage = getCurrentPage()

    if (currentPage === "confirmar") {
      canEnterPage(0)
      // setActiveStep(0);
    } else if (currentPage === "criar") {
      canEnterPage(1)
      // setActiveStep(1);
    } else if (currentPage === "concluido") {
      canEnterPage(2)
      // setActiveStep(2);
    }
  }, [location]);

  return (
    <Sheet sx={{ display: "flex", height: "100vh", position: "sticky" }}>
      <Sidebar isLoggedIn={isLoggedIn} indexSelected={indexSelected} />
      <CssVarsProvider>
        <CssBaseline>
          <Box
            sx={{
              ml: "var(--Sidebar-width)",
              position: "relative",
              display: "flex",
              flexGrow: 1,
              flexDirection: "column",
              px: 5,
              py: 3.5,
            }}
          >
            <GlobalStyles
              styles={(theme) => ({
                ":root": {
                  "--Sidebar-width": "270px",
                },
              })}
            />
            <Stepper size="sm">
              {steps.map((step, index) => (
                <Step
                  key={step.stepText}
                  indicator={
                    <StepIndicator
                      variant={activeStep <= index ? "soft" : "solid"}
                      color={activeStep < index ? "neutral" : "primary"}
                    >
                      {activeStep <= index ? index + 1 : <Check />}
                    </StepIndicator>
                  }
                  sx={{
                    "&::after": {
                      ...(activeStep > index &&
                        index !== 2 && { bgcolor: "primary.solidBg" }),
                    },
                  }}
                >
                  <StepButton
                    onClick={() => {
                      if (index + 1 <= allowedSteps) {
                          const page = materialTypePage === "materiais_producao" ? "materiais_producao" : "materiais_manutencao"
                        navigate(`/${page}/criar_material/${step.pageName}`)
                        setActiveStep(index);
                      }
                    }}
                  >
                    {step.stepText}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            {activeStep === steps[0].activeStep ? (
                <ConfirmarExistencia
                    setAllowedSteps={setAllowedSteps}
                    navigate={navigate}
                    setActiveStep={setActiveStep}
                    allowedSteps={allowedSteps}
                    infoSnackbarOpen={infoSnackbarOpen}
                    setInfoSnackbarOpen={setInfoSnackbarOpen}
                />
            ) : activeStep === steps[1].activeStep ? (
                <FormularioCriarMaterial
                    setActiveStep={setActiveStep}
                    setAllowedSteps={setAllowedSteps}
                />
            ) : activeStep === steps[2].activeStep ? (
                <MaterialCreationDone />
            ) : null}
            <Snackbar
              autoHideDuration={6000}
              open={infoSnackbarOpen}
              variant="soft"
              color="primary"
              onClose={(event, reason) => {
                if (reason === "clickaway") {
                  return;
                }
                setInfoSnackbarOpen(false);
              }}
            >
              Materiais encontrados!
            </Snackbar>
          </Box>
        </CssBaseline>
      </CssVarsProvider>
    </Sheet>
  );
}
