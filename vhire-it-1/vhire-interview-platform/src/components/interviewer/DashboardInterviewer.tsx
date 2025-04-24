import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../config/firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
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

interface InterviewData {
  email: string;
  upiID: string;
  techSkills: string[];
}

interface SuggestedInterviews {
  companyName: string,
  interview_id: string,
  interview_status: string,
  jobDesc: string,
  pointers: string,
  role: string,
  recruitment_id: string,
  skills: string[],
  deadline: string
}

interface GroupedInterviews {
  recruitment_id: string;
  interviews: SuggestedInterviews[];
}

const DashboardInterviewer: React.FC = () => {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');
  const [name, setName] = useState('');
  const [callType, setCallType] = useState<'one-on-one' | 'group' | null>(null);
  const [upcomingInterviews, setUpcomingInterviews] = useState<Interview[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const { user } = useUser();
  const [interviewerData, setInterviewerData] = useState<InterviewData>()
  const [suggestedInterviewData, setSuggestedInterviewData] = useState<SuggestedInterviews[]>();
  const [groupedInterviewData, setGroupedInterviewData] = useState<GroupedInterviews[]>([]);


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

  const fetchInterviewerData = async () => {
    try {
      const q = query(
        collection(db, "interviewer_Users"),
        where("email", "==", user?.email)
      );

      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        const data = doc.data() as InterviewData;

        // Optional: validate fields exist to prevent runtime issues
        const formattedData: InterviewData = {
          email: data.email ?? "",
          upiID: data.upiID ?? "",
          techSkills: data.techSkills ?? [],
        };

        setInterviewerData(formattedData);
      } else {
        console.warn("No matching interviewer found.");
      }
    } catch (error) {
      console.error("Error fetching interviewer data:", error);
    }
  };

  const fetchSuggestedInterviews = async () => {
    try {
      const q = query(
        collection(db, "interviews"),
        where("interview_status", "==", "not scheduled")
      );

      const snapshot = await getDocs(q);
      console.log(snapshot.docs[0].data());

      const filteredResults = snapshot.docs
        .map(doc => ({ ...(doc.data() as SuggestedInterviews) }))
        .filter(doc => {
          if (Array.isArray(doc.skills)) {
            console.log(doc)
            const matches = doc.skills.filter((skill: string) =>
              interviewerData?.techSkills.includes(skill)
            );
            return matches.length >= 2;
          }
          return false;
        });

      console.log(filteredResults);


      const formattedData: SuggestedInterviews[] = filteredResults.map(doc => ({
        companyName: doc.companyName,
        interview_id: doc.interview_id,
        interview_status: doc.interview_status,
        jobDesc: doc.jobDesc,
        pointers: doc.pointers,
        role: doc.role,
        recruitment_id: doc.recruitment_id,
        skills: doc.skills,
        deadline: doc.deadline
      }));

      console.log(formattedData);

      setSuggestedInterviewData(formattedData);

    } catch (error) {
      console.error("Error fetching suggested interviews:", error);
    }
  };


  useEffect(() => {
    fetchInterviewerData();
  }, [user]);

  useEffect(() => {
    if (interviewerData) {
      console.log(interviewerData);
      fetchSuggestedInterviews();
    }
  }, [interviewerData])

  useEffect(() => {
    if (suggestedInterviewData && suggestedInterviewData.length > 0) {
      const groupedArray: GroupedInterviews[] = Object.values(
        suggestedInterviewData.reduce((acc, interview) => {
          const key = interview.recruitment_id;
          if (!acc[key]) {
            acc[key] = { recruitment_id: key, interviews: [] };
          }
          acc[key].interviews.push(interview);
          return acc;
        }, {} as Record<string, GroupedInterviews>)
      );
      console.log(groupedArray);

      setGroupedInterviewData(groupedArray);
    }
  }, [suggestedInterviewData]);


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Interviewer Dashboard</h1>
            <p className="text-gray-600 mt-1">Conduct interviews with candidates</p>
          </div>
          <button
            onClick={() => navigate('/paymentdashboard')}
            className="mt-2 md:mt-0 rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition"
          >
            Interviews and Payment history
          </button>
        </header>


        <div className="grid gap-6 lg:grid-cols-3">
          {/* Schedule Card */}
          <div className="rounded-xl bg-white p-6 shadow-lg space-y-4">
            {/* <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Today's Schedule</h2>
              <button
                onClick={() => navigate('/createschedulemeet')}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                New Schedule
              </button>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
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
            </div> */}

            <div>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-gray-900">Suggested Interviews</h2>
              </div>
              <div className="space-y-4">
                {groupedInterviewData.map((group) => {
                  const recruitmentData = group.interviews[0];

                  return (
                    <button
                      key={group.recruitment_id}
                      className="relative w-full text-left rounded-2xl border border-gray-200 p-4 hover:bg-gray-100 shadow-sm"
                      onClick={() => {
                        navigate(`/scheduleinterview/${group.recruitment_id}`);
                      }}
                    >
                      {/* Deadline in top right */}
                      <span className="absolute top-4 right-4 text-sm text-gray-500">
                        Deadline: {recruitmentData.deadline}
                      </span>

                      {/* Company Info */}
                      <p className="font-bold text-lg text-gray-900">
                        {recruitmentData.companyName}
                      </p>
                      <p className="text-gray-800">
                        Role: <span className="font-medium">{recruitmentData.role}</span>
                      </p>
                      <p className="text-gray-700">
                        Skills:{" "}
                        {recruitmentData.skills.join(", ")}
                      </p>
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
          <div className="rounded-xl bg-white p-6 shadow-lg space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Upcoming Schedule</h2>
              
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
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
                className={`rounded-lg px-4 py-2 text-center transition-colors ${callType === 'one-on-one' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                One on One
              </button>
              <button
                onClick={() => setCallType('group')}
                className={`rounded-lg px-4 py-2 text-center transition-colors ${callType === 'group' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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