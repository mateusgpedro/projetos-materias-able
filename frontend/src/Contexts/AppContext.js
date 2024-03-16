import { createContext, useContext, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userRoles, setUserRoles] = useState();
  const [notificationsCount, setNotificationsCount] = useState();
  const [notifications, setNotifications] = useState();

  return (
    <AppContext.Provider
      value={{
        userRoles,
        setUserRoles,
        notificationsCount,
        setNotificationsCount,
        notifications,
        setNotifications
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  return useContext(AppContext);
};
