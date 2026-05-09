import { useLoader } from "../context/LoaderContext";

export default function GlobalLoader() {

    const { loading } = useLoader();
    console.log("Loader Render", loading);
    if (!loading) return null;

    return (
        <div className="global-loader">
            <div className="spinner"></div>
        </div>
    );
}

