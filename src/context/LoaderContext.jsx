import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

const LoaderContext = createContext();

export const LoaderProvider = ({ children }) => {

    const [loading, setLoading] = useState(false);

    useEffect(() => {

        const showLoader = () => {
            console.log("SHOW");
            setLoading(true);
        };

        const hideLoader = () => {
            console.log("HIDE");
            setLoading(false);
        };

        // const showLoader = () => setLoading(true);

        // const hideLoader = () => setLoading(false);

        window.addEventListener("show-loader", showLoader);
        console.log("Added show-loader event listener");
        window.addEventListener("hide-loader", hideLoader);
        console.log("Added hide-loader event listener");

        return () => {
            window.removeEventListener("show-loader", showLoader);
            window.removeEventListener("hide-loader", hideLoader);
            console.log("Removed event listeners");
        };

    }, []);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);