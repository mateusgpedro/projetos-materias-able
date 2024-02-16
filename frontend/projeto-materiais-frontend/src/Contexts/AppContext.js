import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState();

  return (
    <AppContext.Provider
      value={{
        userRoles,
        setUserRoles,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
