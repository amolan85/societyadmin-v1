import { Routes, Route, Navigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import routes from "./routes";

const TheContent = () => {
  const location = useLocation();
  const storedToken = localStorage.getItem("user");
  return (
    <div>
      <Routes>
        {routes.map((route, idx) => {
          const Component = route.element;

          return (
            <Route
              key={idx}
              path={route.path}
              element={
                storedToken ? <Component /> : <Navigate to="/" replace />
              }
            />
          );
        })}

        {/* fallback */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
};

export default TheContent;