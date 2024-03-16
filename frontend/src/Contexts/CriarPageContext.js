import { createContext, useContext, useState } from "react";

export const CriarPageContext = createContext();

export const CriarPageProvider = ({ children, page }) => {
    const [materialTypePage, setMaterialTypePage] = useState(page);

    return (
        <CriarPageContext.Provider
            value={{
                materialTypePage,
                setMaterialTypePage,
            }}
        >
            {children}
        </CriarPageContext.Provider>
    );
};

export const useCriarPageContext = () => {
    return useContext(CriarPageContext);
};
