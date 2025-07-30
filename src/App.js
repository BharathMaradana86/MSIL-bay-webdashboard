// src/App.js
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Authentication/Login/Login';
import MiniDrawer from './components/MiniDrawer/MiniDrawer';
import { AuthContextProvider, AuthContext } from './utils/Auth.context';
import { useContext } from 'react';
import ProtectedRoutes from './utils/ProtectedRoutes';
import ChangePassword from './pages/Authentication/ChangePassword/ChangePassword';
import { ToastContainer, toast } from "react-toastify";

const AppRoutes = () => {
  const { routes } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<MiniDrawer />}>
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<ProtectedRoutes>{route.element}</ProtectedRoutes>} />
        ))}
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path='/reset' element={ <ChangePassword /> } />
    </Routes>
  );
};

export default function App() {
  return (
    <AuthContextProvider>
            <AppRoutes />
    
    </AuthContextProvider>
  );
}
