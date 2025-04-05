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
}

const DashboardCandidate: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const { user } = useUser();
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const interviewsCollection = collection(db, 'InterviewScheduled');
        const interviewSnapshot = await getDocs(interviewsCollection);
        const interviewsList = interviewSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Interview[];
        const filteredInterviews = interviewsList.filter(
          interview => interview.candidateEmail === user?.email
        );
        setUpcomingInterviews(filteredInterviews);
      } catch (error) {
        console.error('Error fetching interviews: ', error);
      }
    };

    if (user) fetchInterviews();
  }, [user]);

  const handleJoinMeet = () => {
    if (selectedInterview && user && user.email === selectedInterview.candidateEmail) {
        console.log(selectedInterview);
      navigate(
        `room/${selectedInterview.roomId}?type=one-on-one&name=${encodeURIComponent(user.name)}`
      );
    }
  };

  const handleUrgentJoinMeet = () => {
        if(user){
            navigate(
                `room/${roomId}?type=one-on-one&name=${encodeURIComponent(name)}`
            );
        }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl space-y-8">
        <header>
          <h1 className="text-4xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">Manage and join your interviews</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Join Interview</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <div>
                <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
                  Room ID
                </label>
                <input
                  id="roomId"
                  type="text"
                  value={roomId}
                  onChange={e => setRoomId(e.target.value)}
                  placeholder="Enter room ID"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
              </div>
              <button
                onClick={handleUrgentJoinMeet}
                disabled={!name.trim() || !roomId.trim()}
                className="w-full rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Join Interview
              </button>
            </div>
          </section>

          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Interviews</h2>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {upcomingInterviews.length > 0 ? (
                upcomingInterviews.map(interview => (
                  <button
                    key={interview.id}
                    onClick={() => setSelectedInterview(interview)}
                    className={`w-full text-left rounded-lg border p-4 transition hover:bg-gray-100 ${
                      selectedInterview?.id === interview.id ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900">{interview.interviewType}</h3>
                    <p className="text-sm text-gray-500">{interview.exactTiming}</p>
                  </button>
                ))
              ) : (
                <p className="text-gray-500">No upcoming interviews scheduled.</p>
              )}
            </div>
          </section>
        </div>

        {selectedInterview && (
          <section className="bg-white rounded-2xl shadow p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Interview Details</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Interview Type:</strong> {selectedInterview.interviewType}</p>
              <p><strong>Interviewer Email:</strong> {selectedInterview.interviewerEmail}</p>
              <p><strong>Exact Timing:</strong> {selectedInterview.exactTiming}</p>
            </div>
            <button
              onClick={handleJoinMeet}
              className="mt-4 w-full rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Join Meet
            </button>
          </section>
        )}
      </div>
    </div>
  );
};

export default DashboardCandidate;
