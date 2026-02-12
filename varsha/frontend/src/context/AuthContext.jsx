import { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('userInfo');
            if (storedUser && storedUser !== 'undefined') {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error('Failed to parse stored user info', error);
            localStorage.removeItem('userInfo');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('userInfo', JSON.stringify(userData));
        if (userData.role === 'admin') navigate('/admin');
        else if (userData.role === 'counselor') navigate('/counselor');
        else navigate('/dashboard');
    };

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/api/auth/logout');
        } catch (error) {
            console.error('Logout failed', error);
        }
        setUser(null);
        localStorage.removeItem('userInfo');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
