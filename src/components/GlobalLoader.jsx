import React from "react";
import { useLoader } from "../context/LoaderContext";

const GlobalLoader = () => {

    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className="global-loader">
            <div className="spinner"></div>
        </div>
    );
};

export default GlobalLoader;