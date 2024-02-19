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
import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import Check from "@mui/icons-material/Check";
import CheckBoxImage from "../../imgs/Checking boxes-rafiki.png";
import axiosInstance from "../../utils/axiosInstance";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EmptyBoxImage from "../../imgs/Empty-rafiki.png";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import LookForBoxImage from "../../imgs/Checking boxes-bro.png";

const steps = ["Confirmar existência", "Criar Material", "Concluído"];

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

function getMaterialType() {
  const currentPathname = window.location.pathname;

  const parts = currentPathname.split("/");
  const materialType = parts[parts.length - 2];

  return materialType === "materiais_producao" ? "producao" : "manutencao";
}

function ConfirmarExistencia({
  setAllowedSteps,
  allowedSteps,
  setActiveStep,
  infoSnackbarOpen,
  setInfoSnackbarOpen,
}) {
  const [searchType, setSearchType] = useState("description");
  const [successSnackbarOpen, setSuccessSnackbarOpen] = useState(false);
  const [searchString, setSearchString] = useState("");
  const navigate = useNavigate();
  const searchParams = useSearchParams();
  const [searchedMaterials, setSearchMaterials] = useState([]);
  const [switchPage, setSwitchPage] = useState(false);

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
        }&materialType=${materialType}`
      );

      setSearchMaterials(response.data);

      if (response.data.length === 0) {
        setSuccessSnackbarOpen(true);

        switchPage === true ? setAllowedSteps(1) : setAllowedSteps(2);
      } else {
        setInfoSnackbarOpen(true);
        setAllowedSteps(1);
        switchPage === false ? setSwitchPage(true) : setSwitchPage(true);
      }
    } catch (e) {}
  };

  const handleNextPage = async () => {
    setActiveStep(1);
    setAllowedSteps(2);
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("step", 2);
    navigate(`?${updatedSearchParams.toString()}`);
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
          disabled={2 <= allowedSteps ? false : true}
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
class Manufacturer {
  constructor(manufacturerName, manufacturerCode, nameError, codeError) {
    this.manufacturerName = manufacturerName;
    this.manufacturerCode = manufacturerCode;
    this.nameError = nameError;
    this.codeError = codeError;
  }
}

function FormularioCriarMaterial({ setAllowedSteps, setActiveStep }) {
  const [formValues, setFormValues] = useState({
    materialName: "",
    stockSeguranca: "",
    estimatedValue: "",
  });
  const [errorValues, setErrorValues] = useState({
    materialName: "",
    stockSeguranca: "",
    estimatedValue: "",
  });
  const [manufacturers, setManufacturers] = useState([]);
  const [lastFieldUpdated, setLastFieldUpdated] = useState();
  const [lastManufacturerFieldUpdated, setLastManufacturerFieldUpdated] =
    useState();
  const [shouldDisableLastItem, setShouldDisableLastItem] = useState(false);
  const [loadNextStep, setLoadNextStep] = useState();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleNextPage = async () => {
    setActiveStep(2);
    setAllowedSteps(3);
    const updatedSearchParams = new URLSearchParams(searchParams.toString());
    updatedSearchParams.set("step", 3);
    navigate(`?${updatedSearchParams.toString()}`);
  };

  const handleStaticFormChange = (field, value) => {
    setFormValues((prevFormValue) => {
      const updatedFormValues = { ...prevFormValue, [field]: value };
      return updatedFormValues;
    });
    setLastFieldUpdated(field);
  };

  const addManufacturer = () => {
    const newManufacturer = new Manufacturer("", "", "", "");
    setManufacturers((prevManufacturers) => [
      ...prevManufacturers,
      newManufacturer,
    ]);
  };

  const removeManufacturer = (index) => {
    setManufacturers((prevManufacturers) => {
      const updatedManufacturers = [...prevManufacturers];
      updatedManufacturers.splice(index, 1);
      return updatedManufacturers;
    });
  };

  const handleManufacturerChange = (index, field, value) => {
    setManufacturers((prevManufacturers) => {
      const updatedManufacturers = [...prevManufacturers];
      updatedManufacturers[index][field] = value;
      return updatedManufacturers;
    });
    setLastManufacturerFieldUpdated({ index, field });
  };

  const validateField = (field) => {
    let error = "";
    var numberRegex = /^\d+$/;
    let floatRegex = /^\d+([,.]\d{1,2})?$/;

    if (field === "materialName") {
      if (!formValues[field] && error === "") {
        error = "Nome do material necessário";
      }
    }
    if (field === "stockSeguranca") {
      if (!formValues[field] && error === "") {
        error = "Stock de segurança necessário";
      } else if (!numberRegex.test(formValues[field]) && error === "") {
        error = "Stock de segurança deve apenas conter digitos [0-9]";
      }
    }
    if (field === "estimatedValue") {
      if (!formValues[field] && error === "") {
        error = "Valor estimado necessário";
      } else if (!floatRegex.test(formValues[field]) && error === "") {
        error = "Valor estimado deve apenas conter digitos [0-9] e [,-.]";
      }
    }

    setErrorValues((prevErrors) => {
      const updatedErrors = { ...prevErrors, [field]: error };
      return updatedErrors;
    });
  };

  const validateManufacturerField = (index, field) => {
    let error = "";
    let regexCode = /^\d+$/;

    if (field === "manufacturerName") {
      if (!manufacturers[index].manufacturerName && error === "") {
        error = "Nome de fabricante necessário.";
      }
    } else if (field === "manufacturerCode") {
      if (!manufacturers[index].manufacturerCode) {
        error = "Código de fabricante necessário.";
      } else if (!regexCode.test(manufacturers[index]?.manufacturerCode)) {
        error = "Código do fabricante deve conter apenas dígitos [0-9]";
      }
    }

    setManufacturers((prevErrors) => {
      const errorField =
        field === "manufacturerName" ? "errorName" : "errorCode";
      const updatedErrors = [...prevErrors];
      updatedErrors[index][errorField] = error;
      return updatedErrors;
    });
  };

  const handleNextStepFormulario = (e) => {
    e.preventDefault();

    let errors = {};
    var numberRegex = /^\d+$/;
    let floatRegex = /^\d+([,.]\d{1,2})?$/;
    let anyError = false;

    if (!formValues.materialName) {
      errors.materialName = "Nome do material necessário";
      anyError = true;
    }
    if (!formValues.stockSeguranca) {
      errors.stockSeguranca = "Stock de segurança necessário";
      anyError = true;
    } else if (!numberRegex.test(formValues.stockSeguranca)) {
      errors.stockSeguranca =
        "Stock de segurança deve apenas conter digitos [0-9]";
      anyError = true;
    }
    if (!formValues.estimatedValue) {
      errors.estimatedValue = "Stock de segurança necessário";
      anyError = true;
    } else if (!floatRegex.test(formValues.estimatedValue)) {
      errors.estimatedValue =
        "Stock de segurança deve apenas conter digitos [0-9]";
      anyError = true;
    }

    for (let index = 0; index < manufacturers.length; index++) {
      let manufacturerErrors = {};

      if (!manufacturers[index].manufacturerName) {
        manufacturerErrors.errorName = "Nome de fabricante necessário.";
        anyError = true;
      }
      if (!manufacturers[index].manufacturerCode) {
        manufacturerErrors.errorCode = "Código de fabricante necessário.";
        anyError = true;
      } else if (!numberRegex.test(manufacturers[index].manufacturerCode)) {
        manufacturerErrors.errorCode =
          "Código do fabricante deve conter apenas dígitos [0-9]";
        anyError = true;
      }

      if (anyError) {
        setManufacturers((prevErrors) => {
          const updatedErrors = [...prevErrors];
          updatedErrors[index]["errorCode"] = manufacturerErrors.errorCode;
          updatedErrors[index]["errorName"] = manufacturerErrors.errorName;

          return updatedErrors;
        });
      }
    }

    if (!anyError) {
      setLoadNextStep(true);
    } else {
      setErrorValues(errors);
    }
  };

  const fetchCriarMaterial = async () => {
    const materialType = getMaterialType();
    try {
      const manufacturersArray = manufacturers.map(
        ({ manufacturerName, manufacturerCode }) => ({
          ManufacturerName: manufacturerName,
          ManufacturerCode: manufacturerCode,
        })
      );

      const body = {
        Name: formValues.materialName,
        Type: materialType,
        StockSeguranca: formValues.stockSeguranca,
        EstimatedValue: formValues.estimatedValue,
        Manufacturers: manufacturersArray,
      };

      console.log(manufacturersArray);
      console.log(body);

      const response = await axiosInstance.post("materials/add", body);

      console.log(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (loadNextStep === true) {
      fetchCriarMaterial();
      handleNextPage();
      setLoadNextStep(false);
    }
  }, [loadNextStep]);

  useEffect(() => {
    addManufacturer();
  }, []);

  useEffect(() => {
    setShouldDisableLastItem(manufacturers.length === 1);
  }, [manufacturers]);

  useEffect(() => {
    if (
      lastManufacturerFieldUpdated &&
      lastManufacturerFieldUpdated.index !== undefined &&
      lastManufacturerFieldUpdated.field !== undefined
    ) {
      validateManufacturerField(
        lastManufacturerFieldUpdated.index,
        lastManufacturerFieldUpdated.field
      );
    }
  }, [lastManufacturerFieldUpdated]);

  useEffect(() => {
    validateField(lastFieldUpdated);
  }, [formValues, lastFieldUpdated]);

  return (
    <Box
      sx={{
        mt: 20,
        pb: 5,
        gap: 5,
        display: "flex",
        flexDirection: "column",
        mx: "auto",
      }}
    >
      <Typography level="h2">
        Preencha o formulário de criação do material
      </Typography>
      <form onSubmit={handleNextStepFormulario}>
        <Box sx={{ gap: 3, display: "flex", flexDirection: "column" }}>
          <FormControl sx={{ width: "100%" }} error={errorValues.materialName}>
            <FormLabel>Nome do material</FormLabel>
            <Input
              value={formValues.materialName}
              onChange={(e) => {
                handleStaticFormChange("materialName", e.target.value);
              }}
            />
            {errorValues.materialName && (
              <FormHelperText>
                <InfoOutlinedIcon />
                {errorValues.materialName}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl
            sx={{ width: "100%" }}
            error={errorValues.stockSeguranca}
          >
            <FormLabel>Stock de Segurança</FormLabel>
            <Input
              value={formValues.stockSeguranca}
              onChange={(e) => {
                handleStaticFormChange("stockSeguranca", e.target.value);
              }}
            />
            {errorValues.stockSeguranca && (
              <FormHelperText>
                <InfoOutlinedIcon />
                {errorValues.stockSeguranca}
              </FormHelperText>
            )}
          </FormControl>
          <FormControl
            sx={{ width: "100%" }}
            error={errorValues.estimatedValue}
          >
            <FormLabel>{`Valor Estimado (€)`}</FormLabel>
            <Input
              value={formValues.estimatedValue}
              onChange={(e) => {
                handleStaticFormChange("estimatedValue", e.target.value);
              }}
            />
            {errorValues.estimatedValue && (
              <FormHelperText>
                <InfoOutlinedIcon />
                {errorValues.estimatedValue}
              </FormHelperText>
            )}
          </FormControl>
          <Box sx={{ width: "100%" }}>
            <FormLabel>Fabricantes</FormLabel>
            <Box
              sx={{ gap: 2, display: "flex", flexDirection: "column", mt: 2 }}
            >
              {manufacturers.map((manufacturer, index) => (
                <Box
                  sx={{
                    gap: 2,
                    display: "flex",
                    flexDirection: "column",
                    pb: 1,
                  }}
                >
                  <Divider />
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-end",
                      gap: 2,
                    }}
                    key={index}
                  >
                    <FormControl
                      sx={{ flex: 1 }}
                      error={manufacturer.errorName}
                    >
                      <FormLabel>Nome do fabricante</FormLabel>
                      <Input
                        value={manufacturer.manufacturerName}
                        onChange={(e) =>
                          handleManufacturerChange(
                            index,
                            "manufacturerName",
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <FormControl
                      sx={{ flex: 1 }}
                      error={manufacturer.errorCode}
                    >
                      <FormLabel>Código do fabricante</FormLabel>
                      <Input
                        value={manufacturer.manufacturerCode}
                        onChange={(e) =>
                          handleManufacturerChange(
                            index,
                            "manufacturerCode",
                            e.target.value
                          )
                        }
                      />
                    </FormControl>
                    <Button
                      disabled={shouldDisableLastItem}
                      onClick={(e) => {
                        if (manufacturers.length > 1) {
                          removeManufacturer(index);
                        }
                      }}
                      variant="outlined"
                      color="neutral"
                      sx={{
                        maxWidth: "36px",
                        maxHeight: "36px",
                        minWidth: "36px",
                        minHeight: "36px",
                      }}
                    >
                      <DeleteOutlinedIcon />
                    </Button>
                  </Box>
                  {(manufacturer.errorName || manufacturer.errorCode) && (
                    <Box
                      sx={{ display: "flex", gap: 1, flexDirection: "column" }}
                    >
                      {manufacturer.errorName ? (
                        <FormHelperText>
                          <InfoOutlinedIcon fontSize="xl" color="danger" />
                          <Typography color="danger" level="body-sm">
                            {manufacturer.errorName}
                          </Typography>
                        </FormHelperText>
                      ) : null}

                      {manufacturer.errorCode ? (
                        <FormHelperText>
                          <InfoOutlinedIcon fontSize="xl" color="danger" />
                          <Typography color="danger" level="body-sm">
                            {manufacturer.errorCode}
                          </Typography>
                        </FormHelperText>
                      ) : null}
                    </Box>
                  )}
                </Box>
              ))}
            </Box>
            <Button
              sx={{
                width: "auto",
                my: 1,
                alignSelf: "flex-start",
              }}
              size="sm"
              startDecorator={<AddOutlinedIcon />}
              variant="plain"
              onClick={addManufacturer}
            >
              Adicionar Fabricante
            </Button>
          </Box>

          <Button
            sx={{
              justifyContent: "flex-end",
              width: "auto",
              alignSelf: "flex-end",
            }}
            size="sm"
            type="submit"
          >
            Pedir criação de material
          </Button>
        </Box>
      </form>
    </Box>
  );
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

export default function CriarMaterialPage({ isLoggedIn, indexSelected }) {
  const [activeStep, setActiveStep] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const [allowedSteps, setAllowedSteps] = useState(1);
  const [infoSnackbarOpen, setInfoSnackbarOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const step = searchParams.get("step");
    const updatedSearchParams = new URLSearchParams(searchParams);
    updatedSearchParams.set("step", 1);
    if (activeStep !== step || activeStep === undefined) {
      navigate(`?${updatedSearchParams.toString()}`);
    }
  }, []);

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
                  key={step}
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
                        setActiveStep(index);
                        const updatedSearchParams = new URLSearchParams(
                          searchParams
                        );
                        updatedSearchParams.set("step", index + 1);
                        navigate(`?${updatedSearchParams.toString()}`);
                      }
                    }}
                  >
                    {step}
                  </StepButton>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 ? (
              <ConfirmarExistencia
                setAllowedSteps={setAllowedSteps}
                setActiveStep={setActiveStep}
                allowedSteps={allowedSteps}
                infoSnackbarOpen={infoSnackbarOpen}
                setInfoSnackbarOpen={setInfoSnackbarOpen}
              />
            ) : activeStep === 1 ? (
              <FormularioCriarMaterial
                setActiveStep={setActiveStep}
                setAllowedSteps={setAllowedSteps}
              />
            ) : (
              <MaterialCreationDone />
            )}
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
