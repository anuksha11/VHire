// src/components/Register.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebaseConfig';
import AuthService from '../services/auth.service';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [role, setRole] = useState('candidate');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const user = auth.currentUser;
        if (!user) {
            setError('No user logged in.');
            return;
        }

        try {
            await AuthService.completeProfile(user.uid, name, role);
            navigate('/dashboard'); // Redirect after completion
        } catch (error: any) {
            setError(error.message);
            console.error('Profile update failed:', error);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Complete Your Profile</h2>
                <p className="text-gray-500 mb-6">Just a few more details</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Full Name"
                        required
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="candidate">Candidate</option>
                        <option value="interviewer">Interviewer</option>
                        <option value="company">Company</option>
                    </select>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                    >
                        Complete Profile
                    </button>

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                </form>
            </div>
        </div>
    );
};

export default Register;
