// src/components/Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import { FcGoogle } from "react-icons/fc";

const Login: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        setLoading(true);
        setError("");

        try {
            const { user, isNewUser } = await AuthService.loginWithGoogle();

            if (isNewUser) {
                navigate("/register"); // Redirect first-time users
            } else {
                navigate("/dashboard"); // Redirect existing users
            }
        } catch (error: any) {
            setError("Login failed. Please try again.");
            console.error("Login error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Welcome Back!</h2>
                <p className="text-gray-500 mb-6">Sign in with your Google account</p>

                <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="flex items-center justify-center w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition duration-300 disabled:bg-gray-400"
                >
                    {loading ? (
                        <span className="animate-spin h-5 w-5 border-4 border-white border-t-transparent rounded-full"></span>
                    ) : (
                        <>
                            {/* <FcGoogle className="text-2xl mr-2" /> */}
                            Login with Google
                        </>
                    )}
                </button>

                {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}
            </div>
        </div>
    );
};

export default Login;
