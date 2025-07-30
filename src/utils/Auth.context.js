import React, { createContext, useState, useEffect } from "react";
import {
  handleLogin,
  handleMyProfile,
  handleRefreshToken,
  handleRegister,
  handleSignOut,
} from "../API/api";
import Dashboard from "../pages/Dashboard/Dashboard";
import Reports from "../pages/Reports/Reports";
import InspectionDetails from "../pages/InspectionDetails/InspectionDetails";
import ModelDetails from "../pages/ModelDetails/ModelDetails";
import Analytics from "../pages/Analytics/Analytics";
import Configure from "../pages/Configure/Configure";
import { useNavigate } from "react-router-dom";
import UserManagement from "../pages/Authentication/UserManagaement/UserManagement";
import Settings from "../pages/Settings/Settings";
import BayMonitoring from "../pages/BayMonitoring/BayMonitoring";
import LiveStreaming from "../pages/LiveStreaming/LiveStreaming";
import BayHeatMap from "../pages/BayHeatMap/BayHeatMap";

const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [UserCredentials, setUserCredentials] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await handleMyProfile();
        console.log(res);
        if (false) {
          navigate("/Login");
        } else if (res?.data) {
          setUserCredentials([{roles: "admin"}]);
          setRoutes(getRoutesByRole([{roles: "admin"}]));
        }
        if (false) {
          localStorage.accessToken = res?.data?.accessToken;
          const res_1 = await handleMyProfile();
          if (res_1?.data === "ACCESS DENIED" || res_1?.data === undefined) {
            navigate("/Login");
          } else if (res_1?.data) {
            setUserCredentials([{roles: "admin"}]);
            setRoutes(getRoutesByRole([{roles: "admin"}]));
          }
        }
      } catch (error) {
        setUserCredentials([{roles: "admin"}]);
        setRoutes(getRoutesByRole([{roles: "admin"}]));
        console.log(error);
      } finally {
        setUserCredentials([{roles: "admin"}]);
          setRoutes(getRoutesByRole([{roles: "admin"}]));
        setLoading(false); // Set loading to false after the user profile is fetched
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleLoginContext = async (data) => {
    try {
      const res = await handleLogin(data);
      // if (res?.data) {
      //     setUserCredentials(res.data);
      // }
      return res;
    } catch (error) {
      console.log(error);
    }
  };

  const getRoutesByRole = (data) => {
    const allRoutes = [
      { path: "/", element: <Dashboard />, roles: ["user", "admin"] },
      // { path: "/analytics", element: <Analytics />, roles: ["user", "admin"] },
      { path: "/reports", element: <Reports />, roles: ["user", "admin"] },
      // { path: "/configure", element: <Configure />, roles: ["admin"] },
      {
        path: "/inspection/:id/:data",
        element: <InspectionDetails />,
        roles: ["user", "admin"],
      },
      // {
      //   path: "/model/:id/:data",
      //   element: <ModelDetails />,
      //   roles: ["user", "admin"],
      // },
      // { path: "/parts", element: <Settings />, roles: ["admin"] },
      { path: "/user", element: <UserManagement />, roles: ["admin"] },
      {
        path: "/baymonitoring",
        element: <BayMonitoring />,
        roles: ["user", "admin"],
      },
      {
        path: "/livestreaming",
        element: <LiveStreaming />,
        roles: ["user", "admin"],
      },
      {
        path: "/bayHeatMap",
        element: <BayHeatMap />,  
        roles: ["user", "admin"],
      }
    ];
    return allRoutes.filter((item) => item?.roles?.includes(data[0]?.roles));
  };

  return (
    <AuthContext.Provider
      value={{
        UserCredentials,
        handleLoginContext,
        handleRegister,
        handleSignOut,
        handleMyProfile,
        handleRefreshToken,
        routes,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
