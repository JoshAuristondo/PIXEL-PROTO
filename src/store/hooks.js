import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useStore } from './StoreContext';

export const useNow = (ms = 1000) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const t = setInterval(() => setNow(Date.now()), ms);
        return () => clearInterval(t);
    }, [ms]);
    return now;
};

/** Redirige a /login si no hay sesión. Devuelve el usuario (o null mientras redirige). */
export const useRequireUser = () => {
    const { user } = useStore();
    const [, navigate] = useLocation();
    useEffect(() => {
        if (!user) navigate('/login');
    }, [user, navigate]);
    return user;
};
