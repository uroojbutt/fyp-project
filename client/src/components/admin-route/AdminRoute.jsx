// components/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // or your auth context

const AdminRoute = ({ children }) => {
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    return user && user.role === 'admin' ? children : <Navigate to="/login" />;
};

export default AdminRoute;