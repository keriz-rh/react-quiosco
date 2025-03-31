import { useEffect } from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/axios";

export const useAuth = ({ middleware, url } = {}) => {
    const getToken = () => (typeof window !== "undefined" ? localStorage.getItem('AUTH_TOKEN') : null);
    const navigate = useNavigate();

    const fetchUser = async () => {
        try {
            const token = getToken();
            if (!token) throw new Error("No token available");
    
            const { data } = await clienteAxios('/api/user', {
                headers:
                 { Authorization: `Bearer ${token}` }
            });
            return data;
        } catch (error) {
            throw error; // Lanzar error para que useSWR lo detecte
        }
    };
    

    const { data: user, error, mutate } = useSWR(
        getToken() ? '/api/user' : null,  // No ejecuta si no hay token
        fetchUser
    );

    const login = async (datos, setErrores) => {
        try {
            const { data } = await clienteAxios.post('/api/login', datos);
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([]);
            await mutate(); // Refrescar usuario
        } catch (error) {
            const errores = error.response?.data?.errors;
            setErrores(errores ? Object.values(errores) : ['Ocurrió un error inesperado']);
        }
    };

    const registro = async ( datos, setErrores) => {
        try {
            const { data } = await clienteAxios.post('/api/registro', datos)
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([]);
            await mutate();
        } catch (error) {
            setErrores(Object.values(error.response.data.errors));
            
        }
    }

    const logout = async () => {
        localStorage.removeItem('AUTH_TOKEN');
        await mutate(null); // Eliminar usuario de cache
        navigate('/auth/login'); // Redirigir
    };

    useEffect(() => {
        if (middleware === "guest" && url && user) {
            navigate(url, { replace: true });
        }
        
        if (middleware === "guest" && user && user.admin) {
            navigate('/admin');
        }

        if (middleware === "admin" && user && !user.admin) {
            navigate('/');
        }

        if (middleware === "auth" && (error || !user)) {
            navigate("/auth/login", { replace: true });
        }
    }, [user, error, navigate]); 
    

    return {
        login,
        registro,
        logout,
        user,
        error,
    };
};
