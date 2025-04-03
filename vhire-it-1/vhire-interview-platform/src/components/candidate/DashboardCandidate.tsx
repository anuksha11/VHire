// src/components/DashboardCandidate.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardCandidate: React.FC = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [name, setName] = useState('');
    const [callType, setCallType] = useState<'one-on-one' | 'group' | null>(null);

    const handleRoomIdGenerate = () => {
        const randomId = Math.random().toString(36).substring(2, 9);
        const timestamp = Date.now().toString().substring(-4);
        setRoomId(randomId + timestamp);
    };

    const handleOneAndOneCall = () => {
        if (!roomId) {
            alert("Please Generate Room Id First");
            return;
        }
        navigate(`room/${roomId}?type=one-on-one&name=${encodeURIComponent(name)}`);
    };

    const handleGroupCall = () => {
        if (!roomId) {
            alert("Please Generate Room Id First");
            return;
        }
        navigate(`room/${roomId}?type=group-call`);
    };

    const copyToClipboard = () => {
        let link = `https://localhost:3000/room/${roomId}`;
        navigator.clipboard.writeText(link);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
                    <p className="mt-2 text-gray-600">Join your interview sessions</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Join Interview</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Your Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter your name"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="roomId" className="mb-2 block text-sm font-medium text-gray-700">
                                    Room ID
                                </label>
                                <input
                                    id="roomId"
                                    type="text"
                                    value={roomId}
                                    onChange={(e) => setRoomId(e.target.value)}
                                    placeholder="Enter room ID"
                                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <button
                                onClick={handleOneAndOneCall}
                                disabled={!name.trim() || !roomId.trim()}
                                className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Join Interview
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
                        <div className="space-y-4">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900">Technical Interview</h3>
                                <p className="text-sm text-gray-500">Tomorrow at 10:00 AM</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900">HR Interview</h3>
                                <p className="text-sm text-gray-500">Next Week</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardCandidate;
