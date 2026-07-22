import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

export default function PublicRestrictedRoute({ children }) {
    const isAuthenticated = useSelector(
        (state) => state.auth.isAuthenticated
    );

    if (isAuthenticated) {
        return <Navigate to="/profile" replace/>;
    }

    return children;
}