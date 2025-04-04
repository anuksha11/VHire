import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { useUser } from '../../context/UserContext';

interface Interview {
  id: string;
  interviewerEmail: string;
  candidateEmail: string;
  interviewType: string;
  exactTiming: string;
  roomId: string;
  description?: string;
}

const DashboardInterviewer: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [callType, setCallType] = useState<'one-on-one' | 'group' | null>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const { user } = useUser();

  const handleRoomIdGenerate = () => {
    const randomId = Math.random().toString(36).substring(2, 9);
    const timestamp = Date.now().toString().slice(-4);
    setRoomId(randomId + timestamp);
  };

  const navigateToRoom = (type: 'one-on-one' | 'group-call') => {
    if (!roomId) {
      alert("Please generate Room ID first.");
      return;
    }
    navigate(`room/${roomId}?type=${type}&name=${encodeURIComponent(name)}`);
  };

  const handleJoinMeet = () => {
    if (selectedInterview && user?.email === selectedInterview.interviewerEmail) {
      navigate(`room/${selectedInterview.roomId}?type=one-on-one&name=${encodeURIComponent(user.name)}`);
    }
  };

  const copyToClipboard = () => navigator.clipboard.writeText(roomId);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'InterviewScheduled'));
        const interviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Interview[];
        const filtered = interviews.filter(i => i.interviewerEmail === user?.email);
        setUpcomingInterviews(filtered);
      } catch (error) {
        console.error('Error fetching interviews:', error);
      }
    };

    fetchInterviews();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-gray-900">Interviewer Dashboard</h1>
          <p className="text-gray-600 mt-2">Conduct interviews with candidates</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Start Interview Card */}
          <div className="rounded-xl bg-white p-6 shadow-lg space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Start Interview Now</h2>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Your Name</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setCallType('one-on-one')}
                className={`rounded-lg px-4 py-2 text-center transition-colors ${
                  callType === 'one-on-one' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                One on One
              </button>
              <button
                onClick={() => setCallType('group')}
                className={`rounded-lg px-4 py-2 text-center transition-colors ${
                  callType === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Group Call
              </button>
            </div>
            <button
              onClick={handleRoomIdGenerate}
              disabled={!name.trim() || !callType}
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Generate Room ID
            </button>
          </div>

          {/* Schedule Card */}
          <div className="rounded-xl bg-white p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
              <button
                onClick={() => navigate('/createschedulemeet')}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                New Schedule
              </button>
            </div>
            <div className="space-y-3">
              {upcomingInterviews.length ? (
                upcomingInterviews.map(interview => (
                  <button
                    key={interview.id}
                    onClick={() => setSelectedInterview(interview)}
                    className="w-full text-left rounded-lg border border-gray-200 p-4 hover:bg-gray-100"
                  >
                    <h3 className="font-medium text-gray-900">{interview.interviewType} - {interview.candidateEmail}</h3>
                    <p className="text-sm text-gray-500">{interview.exactTiming}</p>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No upcoming interviews scheduled.</p>
              )}
            </div>
          </div>
        </div>

        {/* Interview Details */}
        {selectedInterview && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Details</h2>
            <div className="space-y-2">
              <p><strong>Type:</strong> {selectedInterview.interviewType}</p>
              <p><strong>Description:</strong> {selectedInterview.description || 'N/A'}</p>
              <p><strong>Candidate Email:</strong> {selectedInterview.candidateEmail}</p>
              <p><strong>Timing:</strong> {selectedInterview.exactTiming}</p>
            </div>
            <button
              onClick={handleJoinMeet}
              className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Join Meet
            </button>
          </div>
        )}

        {/* Room ID Display */}
        {roomId && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Room ID</h2>
            <div className="flex items-center gap-4">
              <div className="flex-1 bg-gray-100 p-4 rounded-lg">
                <code className="text-lg font-mono text-gray-700">{roomId}</code>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="rounded-lg bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200"
                >
                  Copy ID
                </button>
                <button
                  onClick={() => navigateToRoom(callType === 'one-on-one' ? 'one-on-one' : 'group-call')}
                  disabled={!name.trim()}
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                >
                  Start Call
                </button>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-500">Share this Room ID with the candidate to join the interview.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardInterviewer;