import React, {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
    Autocomplete,
    Box, Button,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    IconButton,
    Input,
    Option,
    Select,
    Typography
} from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import {getMaterialType, steps} from "./CriarMaterialPage";
import { Switch } from "@mui/joy";
import {useCriarPageContext} from "../../Contexts/CriarPageContext";

class Manufacturer {
    constructor(
        manufacturerId,
        manufacturerCode,
        nameError,
        codeError,
        nameFirstLoad
    ) {
        this.manufacturerId = manufacturerId;
        this.manufacturerCode = manufacturerCode;
        this.nameError = nameError;
        this.codeError = codeError;
        this.nameFirstLoad = nameFirstLoad;
    }
}

class RecipeAddObject {
    constructor(
        skuCode,
        amount,
        codeError,
        amountError
    ) {
        this.skuCode = skuCode;
        this.amount = amount;
        this.codeError = codeError;
        this.amountError = amountError;
    }
}

export function FormularioCriarMaterial({ setAllowedSteps, setActiveStep }) {
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
    const [recipes, setRecipes] = useState([]);
    const [lastFieldUpdated, setLastFieldUpdated] = useState();
    const [lastManufacturerFieldUpdated, setLastManufacturerFieldUpdated] = useState();
    const [lastRecipeFieldUpdated, setLastRecipeFieldUpdated] = useState();
    const [shouldDisableLastItem, setShouldDisableLastItem] = useState(false);
    const [shouldDisableLastRecipeItem, setShouldDisableLastRecipeItem] = useState(false);
    const [loadNextStep, setLoadNextStep] = useState();
    const [manufacturerOptions, setManufacturerOptions] = useState([]);
    const [skuOptions, setSkuOptions] = useState([])
    const [hasLoadedPage, setHasLoadedPage] = useState(false);
    const [isSwitchChecked, setIsSwitchChecked] = useState(false);
    const {materialTypePage, setMaterialTypePage} = useCriarPageContext();

    const navigate = useNavigate();

    const handleNextPage = async () => {
        setActiveStep(2);
        setAllowedSteps(3);

        navigate(`${steps[2].pageName}`);
    };

    const handleStaticFormChange = (field, value) => {
        setFormValues((prevFormValue) => {
            const updatedFormValues = { ...prevFormValue, [field]: value };
            return updatedFormValues;
        });
        setLastFieldUpdated(field);
    };

    const addManufacturer = () => {
        const newManufacturer = new Manufacturer("", "", "", "", true);
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

    const addRecipeObject = () => {
        const newRecipeObect = new RecipeAddObject("", "", "", "");
        setRecipes((prevRecipes) => [
            ...prevRecipes,
            newRecipeObect
        ]);
    }

    const removeRecipeObject = (index) => {
        setRecipes((prevRecipes) => {
            const updatedRecipes = [...prevRecipes];
            updatedRecipes.splice(index, 1);
            return updatedRecipes;
        })
    }

    const handleManufacturerChange = (index, field, value) => {
        if (
            manufacturers[index].nameFirstLoad === true &&
            field == "manufacturerId"
        ) {
            setManufacturers((prevManufacturers) => {
                const updatedManufacturers = [...prevManufacturers];
                updatedManufacturers[index]["nameFirstLoad"] = false;
                return updatedManufacturers;
            });
            return;
        }
        setManufacturers((prevManufacturers) => {
            const updatedManufacturers = [...prevManufacturers];
            updatedManufacturers[index][field] = value;
            return updatedManufacturers;
        });

        setLastManufacturerFieldUpdated({ index, field });
    };

    const handleRecipeChange = (index, field, value) => {
        setRecipes((prevRecipes) => {
            const updatedRecipes = [...prevRecipes];

            // Check if value is not null before accessing 'amount'
            if (value !== null && value !== undefined) {
                // Convert the value to a string before updating the 'amount' field
                updatedRecipes[index][field] = String(value);
            }

            return updatedRecipes;
        });

        setLastRecipeFieldUpdated({ index, field });
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

        if (field === "manufacturerId") {
            if (!manufacturers[index].manufacturerId) {
                error = "É necessário escolher um fabricante.";
            }
        } else if (field === "manufacturerCode") {
            if (!manufacturers[index].manufacturerCode) {
                error = "Código de fabricante necessário.";
            } else if (!regexCode.test(manufacturers[index]?.manufacturerCode)) {
                error = "Código do fabricante deve conter apenas dígitos [0-9]";
            }
        }

        setManufacturers((prevErrors) => {
            const errorField = field === "manufacturerId" ? "nameError" : "codeError";
            const updatedErrors = [...prevErrors];
            updatedErrors[index][errorField] = error;
            return updatedErrors;
        });
    };

    const validateRecipeField = (index, field) => {
        let error = "";
        let regexCode = /^\d+$/;

        if (field === "skuCode") {
            if (!recipes[index].skuCode) {
                error = "É necessário introduzir um SKU."
            }
        } else if (field === "amount") {
            if (!recipes[index].amount) {
                error = "É necessário introduzir uma quantidade"
            } else if (!regexCode.test(recipes[index]?.amount)) {
                error = "Quantidade deve conter apenas dígitos [0-9]";
            }
        }

        setRecipes((prevErrors) => {
            const errorField = field === "skuCode" ? "codeError" : "amountError";
            const updatedErrors = [...prevErrors];
            updatedErrors[index][errorField] = error;
            return updatedErrors;
        });
    }

    const handleNextStepFormulario = async (e) => {
        e.preventDefault();

        let errors = {};
        var numberRegex = /^\d+$/;
        let floatRegex = /^\d+([,.]\d{1,2})?$/;
        let anyError = false;

        if (!formValues.materialName) {
            errors.materialName = "Nome do material necessário";
            anyError = true;
        } else {
            const result = await fetchValidateErrorsOnServer();
            if (result !== "") {
                anyError = true;
                errors.materialName = result;
            }
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
            let anyManufacturerError = false;

            if (!manufacturers[index].manufacturerId) {
                manufacturerErrors.nameError = "Nome de fabricante necessário.";
                anyManufacturerError = true;
                anyError = true;
            }
            if (!manufacturers[index].manufacturerCode) {
                manufacturerErrors.codeError = "Código de fabricante necessário.";
                anyManufacturerError = true;
                anyError = true;
            } else if (!numberRegex.test(manufacturers[index].manufacturerCode)) {
                manufacturerErrors.codeError =
                    "Código do fabricante deve conter apenas dígitos [0-9]";
                anyManufacturerError = true;
                anyError = true;
            }

            if (anyManufacturerError) {
                setManufacturers((prevErrors) => {
                    const updatedErrors = [...prevErrors];
                    updatedErrors[index]["codeError"] = manufacturerErrors.codeError;
                    updatedErrors[index]["nameError"] = manufacturerErrors.nameError;

                    return updatedErrors;
                });
            }
        }

        if (isSwitchChecked) {
            for (let index = 0; index < recipes.length; index++) {
                let recipesErrors = {};
                let anyRecipeError = false;

                if (!recipes[index].skuCode) {
                    recipesErrors.codeError = "É necessário introduzir um SKU."
                    anyRecipeError = true;
                    anyError = true;
                }
                if (!recipes[index].amount) {
                    recipesErrors.amountError = "É necessário introduzir uma quantidade"
                    anyRecipeError = true;
                    anyError = true;
                } else if (!numberRegex.test(recipes[index].amount)) {
                    recipesErrors.amountError = "Quantidade deve conter apenas dígitos [0-9]";
                    anyRecipeError = true;
                    anyError = true;
                }

                if (anyRecipeError) {
                    setRecipes((prevErrors) => {
                        const updatedErrors = [...prevErrors]
                        updatedErrors[index]["codeError"] = recipesErrors.codeError;
                        updatedErrors[index]["amountError"] = recipesErrors.amountError;

                        return updatedErrors;
                    })
                }
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
          ({ manufacturerId, manufacturerCode }) => ({
            ManufacturerId: manufacturerId,
            ManufacturerCode: manufacturerCode,
          })
        );

        let recipeArray;
        if (isSwitchChecked) {
            recipeArray = recipes.map(
                ({ skuCode, amount}) => ({
                    SkuCode: skuCode,
                    Amount: amount
                })
            )
        } else {
            recipeArray = [];
        }
        const body = {
            Name: formValues.materialName,
            Type: materialType,
            StockSeguranca: formValues.stockSeguranca,
            EstimatedValue: formValues.estimatedValue,
            Manufacturers: manufacturersArray,
            SkuCodesAmounts: recipeArray
        };

        const response = await axiosInstance.post("materials/add", body);

        if (response.status === 200) {
          handleNextPage();
        }
      } catch (e) {
        console.error(e);
      }
    };

    const fetchValidateErrorsOnServer = async () => {
        try {
            const response = await axiosInstance.get(`materials/confirm_existence?materialName=${formValues.materialName}&materialType=${materialTypePage}`);

            if (response.data.nameError === "") {
                return "";
            } else {
                return response.data.nameError;
            }

        } catch (e) {
            console.log("Error: ", e)
        }
    }

    const fetchManufacturers = async () => {
        try {
            const response = await axiosInstance.get(
                "manufacturer/get_manufacturers"
            );

            const manufacturersArray = Array.isArray(response.data)
                ? response.data
                : [response.data];

            setManufacturerOptions(manufacturersArray);
        } catch (error) {
            console.error("Failed to fetch Manufacturers:", error);
        }
    };

    const fetchSkus = async () => {
        try {
          const response = await axiosInstance.get(
              "sku/get_all"
          );

          const skusArray = Array.isArray(response.data)
              ? response.data
              : [response.data];

            setSkuOptions(skusArray.map(({ name, code }) => ({ name, code })));
        } catch (e) {
            console.error("Failed to fetch SKUs:", e);
        }
    }

    useEffect(() => {
        const fetchInfo = async () => {
            if (hasLoadedPage === false) {
                await fetchManufacturers()
                await fetchSkus()
                setHasLoadedPage(true);
            }
        }

        fetchInfo();
        addManufacturer();
        addRecipeObject();
    }, []);

    useEffect(() => {
        if (loadNextStep === true) {
            fetchCriarMaterial();
            setLoadNextStep(false);
        }
    }, [loadNextStep]);

    useEffect(() => {
        setShouldDisableLastItem(manufacturers.length === 1);
    }, [manufacturers]);

    useEffect(() => {
        setShouldDisableLastRecipeItem(recipes.length === 1);
    }, [recipes]);

    useEffect(() => {
        if (
            lastManufacturerFieldUpdated &&
            lastManufacturerFieldUpdated.index !== undefined &&
            lastManufacturerFieldUpdated.field !== undefined
        ) {
            validateManufacturerField(lastManufacturerFieldUpdated.index, lastManufacturerFieldUpdated.field);
        }
    }, [lastManufacturerFieldUpdated]);

    useEffect(() => {
        if (lastRecipeFieldUpdated &&
            lastRecipeFieldUpdated.index != undefined &&
            lastRecipeFieldUpdated.field != undefined) {
            validateRecipeField(lastRecipeFieldUpdated.index, lastRecipeFieldUpdated.field);
        }
    }, [lastRecipeFieldUpdated]);

    useEffect(() => {
        validateField(lastFieldUpdated);
    }, [formValues, lastFieldUpdated]);

    if (hasLoadedPage) {
        return (
            <Box
                sx={{
                    mt: 17,
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
                        <FormControl
                            sx={{ width: "100%" }}
                            error={errorValues.materialName}
                        >
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
                                                error={manufacturer.nameError}
                                            >
                                                <FormLabel>Nome do fabricante</FormLabel>
                                                <Select
                                                    size="md"
                                                    placeholder="Escolha um fabricante..."
                                                    value={manufacturer.manufacturerId}
                                                    onChange={(e, newValue) => {
                                                        handleManufacturerChange(
                                                            index,
                                                            "manufacturerId",
                                                            newValue
                                                        );
                                                    }}
                                                    {...(manufacturer.manufacturerId && {
                                                        endDecorator: (
                                                            <IconButton
                                                                size="sm"
                                                                variant="plain"
                                                                color="neutral"
                                                                onMouseDown={(event) => {
                                                                    event.stopPropagation();
                                                                }}
                                                                onClick={() => {
                                                                    handleManufacturerChange(
                                                                        index,
                                                                        "manufacturerId",
                                                                        null
                                                                    );
                                                                }}
                                                            >
                                                                <CloseRoundedIcon />
                                                            </IconButton>
                                                        ),
                                                        indicator: null,
                                                    })}
                                                >
                                                    {manufacturerOptions.map((option, index) => (
                                                        <Option key={index} value={option.id}>
                                                            {option.name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                            <FormControl
                                                sx={{ flex: 1 }}
                                                error={manufacturer.codeError}
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
                                        {(manufacturer.nameError || manufacturer.codeError) && (
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    gap: 1,
                                                    flexDirection: "column",
                                                }}
                                            >
                                                {manufacturer.nameError ? (
                                                    <FormHelperText>
                                                        <InfoOutlinedIcon fontSize="xl" color="danger" />
                                                        <Typography color="danger" level="body-sm">
                                                            {manufacturer.nameError}
                                                        </Typography>
                                                    </FormHelperText>
                                                ) : null}

                                                {manufacturer.codeError ? (
                                                    <FormHelperText>
                                                        <InfoOutlinedIcon fontSize="xl" color="danger" />
                                                        <Typography color="danger" level="body-sm">
                                                            {manufacturer.codeError}
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

                        {materialTypePage === "materiais_producao" &&  (
                            <Box >
                                <Divider/>

                                <Box sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2, mt: 3}}>
                                    <Switch

                                        sx={{
                                            "--Switch-gap": "20px",
                                            "--Switch-trackWidth": "31px",
                                            "--Switch-trackHeight": "13px",
                                            alignSelf: "flex-start",
                                        }}
                                        checked={isSwitchChecked}
                                        onChange={(event) => {
                                            setIsSwitchChecked(event.target.checked);
                                        }}
                                        startDecorator={
                                        <Typography level="title-md">Pretendo adicionar o material a receitas existentes</Typography>}
                                    />
                                    { isSwitchChecked && (
                                        recipes.map((recipe, index) => (
                                            <Box sx={{display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
                                                <Divider/>
                                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 2, alignItems: "flex-end"}}>
                                                    <FormControl sx={{ flex: 1 }} error={recipe.codeError}>
                                                        <FormLabel>Nome do SKU</FormLabel>
                                                        <Autocomplete
                                                            value={skuOptions.find(option => option.code === recipe.skuCode) || null}
                                                            onChange={(event, newValue) => {
                                                                const newCode = newValue?.code !== undefined ? newValue.code : "";
                                                                handleRecipeChange(index, "skuCode", newCode);
                                                            }}
                                                            placeholder="Escolha o SKU" options={skuOptions}
                                                            getOptionLabel={(option) => option.name}
                                                        />
                                                    </FormControl>
                                                    <FormControl sx={{ flex: 1 }} error={recipe.amountError}>
                                                        <FormLabel>Quantidade</FormLabel>
                                                        <Input
                                                            value={recipe.amount}
                                                            onChange={(e) => {
                                                            handleRecipeChange(index, "amount", e.target.value)
                                                        }}/>
                                                    </FormControl>
                                                    <Button
                                                        disabled={shouldDisableLastRecipeItem}
                                                        onClick={(e) => {
                                                            if (recipes.length > 1) {
                                                                removeRecipeObject(index);
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
                                                {(recipe.codeError || recipe.amountError) && (
                                                    <Box
                                                        sx={{
                                                            display: "flex",
                                                            gap: 1,
                                                            flexDirection: "column",
                                                        }}
                                                    >
                                                        {recipe.codeError ? (
                                                            <FormHelperText>
                                                                <InfoOutlinedIcon fontSize="xl" color="danger" />
                                                                <Typography color="danger" level="body-sm">
                                                                    {recipe.codeError}
                                                                </Typography>
                                                            </FormHelperText>
                                                        ) : null}

                                                        {recipe.amountError ? (
                                                            <FormHelperText>
                                                                <InfoOutlinedIcon fontSize="xl" color="danger" />
                                                                <Typography color="danger" level="body-sm">
                                                                    {recipe.amountError}
                                                                </Typography>
                                                            </FormHelperText>
                                                        ) : null}
                                                    </Box>
                                                )}
                                            </Box>
                                        ))
                                    )}
                                    { isSwitchChecked && (
                                        <Button
                                            sx={{
                                                width: "auto",

                                                alignSelf: "flex-start",
                                            }}
                                            size="sm"
                                            startDecorator={<AddOutlinedIcon />}
                                            variant="plain"
                                            onClick={addRecipeObject}
                                        >
                                            Adicionar a receita
                                        </Button>
                                    )}
                                </Box>
                            </Box>
                        )}
                        <Button
                            sx={{
                                mt: 2,
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
}