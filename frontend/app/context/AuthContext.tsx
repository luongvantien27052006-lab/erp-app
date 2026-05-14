"use client";

import { createContext, useContext, useEffect, useState } from "react";

type User = {
    id: number;
    fullName: string;
    role: string;
    code: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (data: any) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType>({} as any);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const t = localStorage.getItem("token");
        const u = localStorage.getItem("user");

        if (t && u) {
            setToken(t);
            setUser(JSON.parse(u));
        }
    }, []);

    const login = (data: any) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));

        setToken(data.token);
        setUser(data.user);
    };

    const logout = () => {
        localStorage.clear();
        setUser(null);
        setToken(null);
        window.location.href = "/login";
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);