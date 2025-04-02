import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardCompany: React.FC = () => {
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
        navigate(`room/${roomId}?type=one-on-one`);
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
                    <h1 className="text-3xl font-bold text-gray-900">Company Dashboard</h1>
                    <p className="mt-2 text-gray-600">Schedule and manage interviews</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Schedule Interview</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                                    Interviewer Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Enter interviewer name"
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
                                Generate Link
                            </button>
                        </div>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Upcoming Interviews</h2>
                        <div className="space-y-4">
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900">Technical Round - John Doe</h3>
                                <p className="text-sm text-gray-500">Today at 2:00 PM</p>
                            </div>
                            <div className="rounded-lg border border-gray-200 p-4">
                                <h3 className="font-medium text-gray-900">Group Discussion</h3>
                                <p className="text-sm text-gray-500">Tomorrow at 11:00 AM</p>
                            </div>
                        </div>
                    </div>
                </div>

                {roomId && (
                    <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold text-gray-900">Interview Link</h2>
                        <div className="flex items-center gap-4">
                            <div className="flex-1 rounded-lg bg-gray-50 p-4">
                                <code className="text-sm text-gray-700">
                                    {`${window.location.origin}/room/${roomId}`}
                                </code>
                            </div>
                            <button
                                onClick={copyToClipboard}
                                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
                            >
                                Copy
                            </button>
                        </div>
                        <p className="mt-2 text-sm text-gray-500">
                            Share this link with candidates to join the interview
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardCompany;