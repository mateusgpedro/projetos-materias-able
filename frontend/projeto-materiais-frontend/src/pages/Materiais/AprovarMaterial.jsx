import BeableBase from "../BeableBase";
import {useEffect, useState} from "react";
import axiosInstance from "../../utils/axiosInstance";
import {useSearchParams} from "react-router-dom";

export default function AprovarMaterial({indexSelected, setIsLoggedIn}) {
    const [material, setMaterial] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    const fetchMaterial = async () => {
        try {
            const response = await axiosInstance.get(`materials/get_unapproved?materialId=${searchParams.get("m")}`)

            console.log(response.data);
        } catch (e) {
            console.error(e);
        }
    }

    useEffect(() => {
        fetchMaterial()
    }, []);

    return (
        <BeableBase indexSelected={indexSelected} setIsLoggedIn={setIsLoggedIn}>

        </BeableBase>
    )
}