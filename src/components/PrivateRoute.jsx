import { Navigate, Outlet } from "react-router-dom";
import useAutStatus from "../hooks/useAutStatus";
import Spinner from "./Spinner";

const PrivateRoute = () => {
    const { loggedIn, loading } = useAutStatus();

    if (loading) {
        return <Spinner />;
    }

    return loggedIn ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
