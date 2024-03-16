import {useAppContext} from "../Contexts/AppContext";
import {Navigate, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";

export default function RoleProtectedRoute({ children, allowedRoles }) {
    const { userRoles } = useAppContext();

    if (allowedRoles.some(role => userRoles.includes(role))) {
        return children;
    } else {
        // Returning Navigate directly within useEffect might cause issues, use it inside render
        return <Navigate to="/dashboard" />;
    }
}