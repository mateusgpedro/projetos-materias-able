import BeableBase from "../BeableBase";
import React, {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import {useLocation, useNavigate, useSearchParams} from "react-router-dom";
import {
    Box,
    Button,
    FormControl,
    FormHelperText,
    FormLabel,
    Input,
    Radio,
    RadioGroup,
    Textarea,
    Typography
} from "@mui/joy";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function AprovarMaterial({indexSelected, setIsLoggedIn}) {
    const [material, setMaterial] = useState();
    const [searchParams] = useSearchParams();
    const [approve, setApprove] = useState("Aprovar")
    const [rejectionReason, setRejectionReason] = useState();
    const [rejectionReasonError, setRejectionReasonError] = useState("");
    const [firstLoad, setFirstLoad] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchMaterial = async () => {
        try {
            const response = await axiosInstance.get(`materials/get_unapproved?materialId=${searchParams.get("m")}`)

            if (response.status === 400) {
                navigate("/dashboard");
            }

            setMaterial(response.data);
        } catch (e) {
            navigate("/dashboard");
            console.error(e);
        }
    }

    const fetchApproval = async () => {
        let wasApproved = (approve === "Aprovar");

        let body = {
            materialId: searchParams.get("m"),
            wasApproved: wasApproved,
            reason: approve === "Aprovar" ? rejectionReason : null
        };

        const response = await axiosInstance.post(
            "materials/approval",
                body
            );
    }

    useEffect(() => {
        fetchMaterial();
    }, [location]);

    useEffect(() => {
        fetchMaterial();
    }, []);

    useEffect(() => {
        if (firstLoad) {
            setFirstLoad(true)
            return;
        }
        if (rejectionReason === "") {
            setRejectionReasonError("Campo necessário");
        } else {
            setRejectionReasonError(null);
        }
    }, [rejectionReason, firstLoad]);

    return (
        <BeableBase indexSelected={indexSelected} setIsLoggedIn={setIsLoggedIn}>
            <Box sx={{alignSelf: "center", textAlign: "center", mt: 10, pb: 4}}>
                <Typography level="h2">Aprovar pedido de criação de material</Typography>
                <Box sx={{backgroundColor: "neutral.100", width: "850px", borderRadius: "10px",p: 2, mt: 3, gap: 2, display: "flex", flexDirection: "column", boxShadow: "sm"}}>
                    <FormControl>
                        <FormLabel>Nome do material</FormLabel>
                        <Input disabled={true} value={material?.name}/>
                    </FormControl>
                    <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 2}}>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Stock de segurança</FormLabel>
                            <Input disabled={true} value={material?.stockSeguranca}/>
                        </FormControl>
                        <FormControl sx={{flex: 1}}>
                            <FormLabel>Valor Estimado (€)</FormLabel>
                            <Input disabled={true} value={material?.cost}/>
                        </FormControl>
                    </Box>
                    <Box sx={{display: "flex", flexDirection: "column", pt: 2}}>
                        <Typography level="title-md" sx={{textAlign: "start"}}>Associar a fabricantes</Typography>
                        <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 2, mt: 2}}>
                            <Box sx={{display: "flex", flexDirection: "column", flex: 1, gap: 1}}>
                            <FormLabel>Nome do fabricante</FormLabel>
                                {material?.manufacturers.map((manufacturer, index) => (
                                    <Input key={index} disabled={true} value={manufacturer.manufacturerName}/>
                                ))}
                            </Box>
                            <Box sx={{display: "flex", flexDirection: "column", flex: 1, gap: 1}}>
                                <FormLabel>Código do fabricante</FormLabel>
                                {material?.manufacturers.map((manufacturer, index) => (
                                    <Input key={index} disabled={true} value={manufacturer.manufacturerCode}/>
                                ))}
                            </Box>
                        </Box>
                    </Box>

                    {material?.recipes.length !== 0 && (
                        <Box sx={{display: "flex", flexDirection: "column", pt: 2}}>
                            <Typography level="title-md" sx={{textAlign: "start"}}>Adicionar a receitas</Typography>
                            <Box sx={{display: "flex", flexDirection: "row", width: "100%", gap: 2, mt: 2}}>
                                <Box sx={{display: "flex", flexDirection: "column", flex: 1, gap: 1}}>
                                    <FormLabel>Nome da receita</FormLabel>
                                    {material?.recipes.map((recipe, index) => (
                                        <Input key={index} disabled={true} value={recipe.skuName}/>
                                    ))}
                                </Box>
                                <Box sx={{display: "flex", flexDirection: "column", flex: 1, gap: 1}}>
                                    <FormLabel>Quantidade</FormLabel>
                                    {material?.recipes.map((recipe, index) => (
                                        <Input key={index} disabled={true} value={recipe.amount}/>
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    )}

                </Box>
                <RadioGroup
                    orientation="horizontal"
                    aria-labelledby="segmented-controls-example"
                    name="justify"
                    value={approve}
                    onChange={(event) => setApprove(event.target.value)}
                    sx={{
                        boxShadow: "sm",
                        alignSelf: "flex-start",
                        mt: 2,
                        minHeight: 45,
                        padding: '5px',
                        borderRadius: '12px',
                        width: "fit-content",
                        bgcolor: 'neutral.100',
                        '--RadioGroup-gap': '4px',
                        '--Radio-actionRadius': '8px',
                    }}
                >
                    {['Aprovar', 'Rejeitar'].map((item) => (
                        <Radio
                            key={item}
                            color="neutral"
                            value={item}
                            disableIcon
                            label={item}
                            variant="plain"
                            sx={{
                                px: 2,
                                alignItems: 'center',
                            }}
                            slotProps={{
                                action: ({ checked }) => ({
                                    sx: {
                                        ...(checked && {
                                            bgcolor: 'background.surface',
                                            boxShadow: 'sm',
                                            '&:hover': {
                                                bgcolor: 'background.surface',
                                            },
                                        }),
                                    },
                                }),
                            }}
                        />
                    ))}
                </RadioGroup>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    if (rejectionReason === "") {
                        setRejectionReasonError("Campo necessário");
                    } else {
                        fetchApproval();
                        navigate("/dashboard")
                    }
                }}>
                     {approve !== "Aprovar" && (
                        <FormControl error={rejectionReasonError} sx={{backgroundColor: "neutral.100", width: "850px", borderRadius: "10px",p: 2, mt: 2, gap: 1, display: "flex", flexDirection: "column", boxShadow: "sm"}}>
                            <FormLabel>Motivo de rejeição</FormLabel>
                            <Textarea onChange={(e) => {
                                setRejectionReason(e.target.value);
                            }} value={rejectionReason} minRows={3} placeholder="Insira o motivo da rejeição..."/>
                            {rejectionReasonError && (
                                <FormHelperText>
                                    <InfoOutlinedIcon fontSize="xl" color="danger" />
                                    <Typography color="danger" level="body-sm">
                                        {rejectionReasonError}
                                    </Typography>
                                </FormHelperText>
                            )}
                        </FormControl>
                     )}
                    <Button type="submit" sx={{alignSelf: "flex-start", display: "flex", mt: 2, width: "100px"}}>Concluir</Button>
                </form>
            </Box>
        </BeableBase>
    )
}