import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../../config/firebaseConfig";
import { X } from "lucide-react";
import { stringify } from "node:querystring";
import { useUser } from "../../context/UserContext";

interface SuggestedInterviews {
  companyName: string;
  interview_id: string;
  interview_status: string;
  jobDesc: string;
  pointers: string;
  role: string;
  recruitment_id: string;
  skills: string[];
  deadline: string;
  candidateEmail: string;
}

const ScheduleInterview = () => {
  const { recruitmentId } = useParams();
  const [isOpen, setIsOpen] = useState(false);
  const [interviewData, setInterviewData] = useState<SuggestedInterviews[] | null>(null);
  const candidates = ["Candidate 1", "Candidate 2", "Candidate 3"];
  const [remainingCandidates, setRemainingCandidates] = useState(0);
  const [selectedCount, setSelectedCount] = useState<number>(1);
  const {user} = useUser();
  const [schedules, setSchedules] = useState<
    {
      interview_id: string;
      recruitment_id: string;
      email: string;
      date: string;
      time: string;
    }[]
  >([]);

  const fetchInterview = async () => {
    if (!recruitmentId) return;
    try {
      const q = query(
        collection(db, "interviews"),
        where("interview_status", "==", "not scheduled"),
        where("recruitment_id", "==", recruitmentId)
      )
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const doc = snapshot.docs;
        setRemainingCandidates(doc.length);
        const data = snapshot.docs
          .map(doc => ({ ...(doc.data() as SuggestedInterviews) }))
        console.log(data);
        const formattedData: SuggestedInterviews[] = data.map(doc => ({
          companyName: doc.companyName,
          interview_id: doc.interview_id,
          interview_status: doc.interview_status,
          jobDesc: doc.jobDesc,
          pointers: doc.pointers,
          role: doc.role,
          recruitment_id: doc.recruitment_id,
          skills: doc.skills,
          deadline: doc.deadline,
          candidateEmail: doc.candidateEmail,
        }));

        console.log(formattedData);

        setInterviewData(formattedData);


      };
    } catch (err) {
      console.error("Error fetching interview data:", err);
    }
  };
  useEffect(() => {
    fetchInterview();
  }, [recruitmentId]);

  const handleScheduleChange = (
    index: number,
    field: "date" | "time",
    value: string
  ) => {
    setSchedules((prev) => {
      if (interviewData) {
        const candidate = interviewData[index];
        const updated = [...(prev || [])]; // Ensure prev is an array
        updated[index] = {
          ...(updated[index] || {
            interview_id: candidate.interview_id,
            recruitment_id: candidate.recruitment_id,
            email: candidate.candidateEmail,
          }),
          [field]: value,
        };
        return updated; // Always return an array
      }
      return prev; // Return the previous state if interviewData is not available
    });
  };
  const handleSubmit = async () => {
    console.log("Scheduled Candidates:", schedules);
    if(!schedules) {
      //popup code
      console.log("scheduled data not found");
      
    }

    schedules.map(async (schedule)=>{
      console.log(schedule);
      if (!recruitmentId) {
        console.error("Recruitment ID is undefined.");
        return; // Exit the function if recruitmentId is not available
      }
      
      try {
        const q = query(
          collection(db, "interviews"),
          where("interview_id", "==", schedule.interview_id)
        );
        const querySnapshot = await getDocs(q);
        const combinedDateTime = new Date(`${schedule.date}T${schedule.time}`);
        const generatedRoomId =  Math.random().toString(36).substring(2, 9);

        const updatePromises = querySnapshot.docs.map((document) => {
          const docRef = doc(db, "interviews", document.id);
          return updateDoc(docRef, {
            interview_status: "scheduled",
            timing: combinedDateTime,
            interviewerEmail: user?.email,
            roomId: generatedRoomId,
          });
        });
    
        // Step 3: Wait for all updates to complete
        await Promise.all(updatePromises);
        console.log("All matching interviews updated.");

        // Send email to the candidate
      const emailResponse = await fetch("http://localhost:5001/api/sendInterviewScheduledEmail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: schedule.email,
          date: schedule.date,
          time: schedule.time,
          interviewer: user?.email,
          // roomId: generatedRoomId,
        }),
      });

      if (!emailResponse.ok) {
        console.error(`Failed to send email to ${schedule.email}`);
      } else {
        console.log(`Email sent to ${schedule.email}`);
      }

      } catch (error) {
        console.log(error);
        
      }

    })



    setIsOpen(false);
    
  };


  if (!interviewData) {
    return <div className="text-gray-600 p-4">Loading interview info...</div>;
  }

  return (
    <div className="rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow bg-white space-y-4">
      <p className="text-xl font-semibold text-gray-900">{interviewData[0].companyName}</p>
      <p className="text-sm text-gray-600">{remainingCandidates} candidates are yet to be scheduled</p>

      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-1">Job Description</h3>
        <p className="text-gray-700 text-sm leading-relaxed max-w-prose">{interviewData[0].jobDesc}</p>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-800 mb-1">Skills Required</h3>
        <div className="flex flex-wrap gap-2">

          {/* {interviewData[0].skills[0].map((skill) => (
            <span
              key={skill}
              className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
            >
              {skill}
            </span>
          ))} */}
        </div>
      </div>

      <div>
        <button
          className="mt-4 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          Select and Schedule
        </button><label className="block text-sm font-medium text-gray-700 mb-1">
          Select number of candidates for interview
        </label>
        <input
          type="number"
          min={1}
          max={Math.min(remainingCandidates, 5)}
          value={selectedCount}
          onChange={(e) => setSelectedCount(Number(e.target.value))}
          className="w-24 border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">
          You can select up to {Math.min(remainingCandidates, 5)} candidates
        </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-white/30">
          <div className="relative bg-white border border-gray-300 p-6 rounded-xl w-[480px] max-h-[90vh] overflow-y-auto shadow-xl space-y-4">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
              onClick={() => setIsOpen(false)}
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 text-center">
              Schedule Candidates
            </h2>
            <p className="text-sm text-gray-600 text-center">
              You can select up to {selectedCount} candidates.
            </p>

            {interviewData.slice(0, selectedCount).map((candidate, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium text-gray-800">
                  {candidate.candidateEmail}
                </p>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900"
                  onChange={(e) =>
                    handleScheduleChange(index, "date", e.target.value)
                  }
                />
                <input
                  type="time"
                  className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm text-gray-900"
                  onChange={(e) =>
                    handleScheduleChange(index, "time", e.target.value)
                  }
                />
              </div>
            ))}

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition"
              >
                Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleInterview;
