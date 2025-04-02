import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardInterviewer: React.FC = () => {
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
        navigate(`room/${roomId}?type=group-call&name=${encodeURIComponent(name)}`);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(roomId);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Interviewer Dashboard</h1>
                    <p className="mt-2 text-gray-600">Conduct interviews with candidates</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Start Interview</h2>
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
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => setCallType('one-on-one')}
                                    className={`flex items-center justify-center gap-2 rounded-lg p-4 transition-all ${
                                        callType === 'one-on-one'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    One on One
                                </button>
                                <button
                                    onClick={() => setCallType('group')}
                                    className={`flex items-center justify-center gap-2 rounded-lg p-4 transition-all ${
                                        callType === 'group'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Group Call
                                </button>
                            </div>
                            <button
                                onClick={handleRoomIdGenerate}
                                disabled={!name.trim() || !callType}
                                className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
                            >
                                Generate Room ID
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Today's Schedule</h2>
                        <div className="space-y-4">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900">Technical Interview - Candidate A</h3>
                                <p className="text-sm text-gray-500">10:00 AM - 11:00 AM</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900">Technical Interview - Candidate B</h3>
                                <p className="text-sm text-gray-500">2:00 PM - 3:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {roomId && (
                    <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Room ID</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                                <code className="text-lg font-mono text-gray-700">
                                    {roomId}
                                </code>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={copyToClipboard}
                                    className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                                >
                                    Copy ID
                                </button>
                                <button
                                    onClick={callType === 'one-on-one' ? handleOneAndOneCall : handleGroupCall}
                                    disabled={!name.trim()}
                                    className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                                >
                                    Start Call
                                </button>
                            </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Share this Room ID with the candidate to join the interview
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardInterviewer; 