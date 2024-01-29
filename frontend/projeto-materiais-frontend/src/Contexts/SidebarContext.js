import { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [openLocasInstalacao, setOpenLocasInstalacao] = useState(false);
  const [openListaMateriais, setOpenListaMateriais] = useState(false);
  const [openArmazens, setOpenArmazens] = useState(false);
  const [openFabrica, setOpenFabrica] = useState(false);
  const [openMovimentosMateriais, setOpenMovimentosMateriais] = useState(false);
  const [openPlaneamentoMateriais, setOpenPlaneamentoMateriais] =
    useState(false);
  const [openInventario, setOpenInventario] = useState(false);
  const [openRelatorio, setOpenRelatorio] = useState(false);

  return (
    <SidebarContext.Provider
      value={{
        openLocasInstalacao,
        setOpenLocasInstalacao,

        openArmazens,
        setOpenArmazens,

        openFabrica,
        setOpenFabrica,

        openListaMateriais,
        setOpenListaMateriais,

        openMovimentosMateriais,
        setOpenMovimentosMateriais,

        openPlaneamentoMateriais,
        setOpenPlaneamentoMateriais,

        openInventario,
        setOpenInventario,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebarContext = () => {
  return useContext(SidebarContext);
};
