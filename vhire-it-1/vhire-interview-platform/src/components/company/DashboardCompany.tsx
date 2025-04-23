import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { db } from '../../config/firebaseConfig';
import { useUser } from '../../context/UserContext';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';

const DashboardCompany: React.FC = () => {
  const [interviews, setInterviews] = useState<any[]>([]);
  const [candidateEmails, setCandidateEmails] = useState<string[]>([]);
  const [selectedFileName, setSelectedFileName] = useState<string>('');
  const [formValues, setFormValues] = useState({
    role: '',
    deadline: '',
    jobDesc: '',
    skills: '',
    pointers: ''
  });
  const { user, login } = useUser();
  const getCompanyNameByEmail = async () => {
    const companyRef = collection(db, 'company_users');
    const querySnapshot = await getDocs(query(companyRef, where("email", "==", user?.email)));
    const companyDoc = querySnapshot.docs[0];
    return companyDoc ? companyDoc.data().companyName : null;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFileName(file.name);

    Papa.parse(file, {
      skipEmptyLines: true,
      complete: (results: Papa.ParseResult<any>) => {
        const data = results.data
        .slice(1)
        .map((row: any) => String(Object.values(row)[0])) // Ensure type is string
        .filter((value) => Boolean(value));
      setCandidateEmails(data);
      },
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const sendWelcomeEmails = async (emails: string[]) => {
    try {
      const response = await fetch('http://localhost:5001/send-welcome-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emails })
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log("Welcome emails sent successfully.");
      } else {
        console.error("Error sending emails:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitToDatabase = async () => {
    const companyName = await getCompanyNameByEmail();
    if (!companyName || !formValues.role || !formValues.deadline || !formValues.jobDesc || !formValues.skills || !formValues.pointers) {
      alert("All form fields are required.");
      return;
    }

    const recruitmentId = uuidv4();
    const interviewsRef = collection(db, 'interviews');

    for (const email of candidateEmails) {
      const interviewData = {
        candidateEmail: email,
        jobDesc: formValues.jobDesc,
        role: formValues.role,
        skills: formValues.skills.split(',').map(skill => skill.trim()),
        pointers: formValues.pointers,
        deadline: formValues.deadline,
        companyName: companyName,
        interview_id: uuidv4(),
        recruitment_id: recruitmentId,
        interviewerEmail: '',
        timing: '',
        roomId: '',
        interview_status: 'not scheduled',
        verifiedCandidateEmail: '',
        verifiedInterviewerEmail: ''
      };
      await addDoc(interviewsRef, interviewData);
    }
    await sendWelcomeEmails(candidateEmails);
    setCandidateEmails([]);
    setSelectedFileName('');
    setFormValues({ role: '', deadline: '', jobDesc: '', skills: '', pointers: '' });
    fetchInterviews();
  };

  const fetchInterviews = async () => {
    const interviewsRef = collection(db, 'interviews');
    const companyName = await getCompanyNameByEmail();
  
    if (!companyName) {
      console.error('No company found for this email.');
      return;
    }
  
    const q = query(interviewsRef, where("companyName", "==", companyName));
    const querySnapshot = await getDocs(q);
  
    const interviewsData = await Promise.all(querySnapshot.docs.map(async (doc) => {
      const interview = doc.data();
      const interviewId = interview.interview_id;
      const interviewStatus = interview.interview_status;
  
      // Check if interview status is eligible for fetching report
      if (interviewStatus === "completed") {
        const reportRef = collection(db, 'interview_report');
        const reportQuery = query(reportRef, where("interview_id", "==", interviewId));
        const reportSnapshot = await getDocs(reportQuery);
  
        let reportData = {
          verdict: "NA",
          status: "NA",
          rating: "NA"
        };
  
        if (!reportSnapshot.empty) {
          const reportDoc = reportSnapshot.docs[0].data(); // assuming one-to-one mapping
          reportData = {
            verdict: reportDoc.verdict || "NA",
            status: reportDoc.status || "NA",
            rating: reportDoc.rating || "NA",
          };
        }
  
        return {
          ...interview,
          ...reportData
        };
      } else {
        return {
          ...interview,
          verdict: "NA",
          status: "NA",
          rating: "NA"
        };
      }
    }));
  
    setInterviews(interviewsData);
  };
  
  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>

      {/* CSV Upload */}
      <div className="mb-4 flex items-center gap-3">
        <label htmlFor="csvUpload" className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400">
          📄 Choose CSV File
        </label>
        <input id="csvUpload" type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        {selectedFileName && <span className="text-gray-700 text-sm">{selectedFileName}</span>}
      </div>

      {/* Form Fields */}
      <div className="mb-4 space-y-2">
        <input name="role" value={formValues.role} onChange={handleFormChange} placeholder="Role" className="w-full p-2 border rounded" required />
        <input name="deadline" type="date" value={formValues.deadline} onChange={handleFormChange} className="w-full p-2 border rounded" required />
        <textarea name="jobDesc" value={formValues.jobDesc} onChange={handleFormChange} placeholder="Job Description" className="w-full p-2 border rounded" required />
        <input name="skills" value={formValues.skills} onChange={handleFormChange} placeholder="Skills Required (comma separated)" className="w-full p-2 border rounded" required />
        <input name="pointers" value={formValues.pointers} onChange={handleFormChange} placeholder="Pointers" className="w-full p-2 border rounded" required />
      </div>

      {/* Preview Section */}
      {candidateEmails.length > 0 && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Preview</h2>
          <ul className="list-disc pl-5 mb-4">
            {candidateEmails.map((email, index) => (
              <li key={index}>{email}</li>
            ))}
          </ul>
          <div className="p-4 bg-gray-100 rounded">
            <p><strong>Role:</strong> {formValues.role}</p>
            <p><strong>Deadline:</strong> {formValues.deadline}</p>
            <p><strong>Job Description:</strong> {formValues.jobDesc}</p>
            <p><strong>Skills Required:</strong> {formValues.skills}</p>
            <p><strong>Pointers:</strong> {formValues.pointers}</p>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmitToDatabase}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Submit to Database
      </button>

      {/* Interviews List */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Interviews List</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Candidate Email</th>
                <th className="p-2 border">Role</th>
                <th className="p-2 border">Deadline</th>
                <th className="p-2 border">Interview Status</th>
                <th className="p-2 border"> Status</th>
                <th className="p-2 border">Verdict</th>
                <th className="p-2 border"> Rating</th>
              </tr>
            </thead>
            <tbody>
              {interviews.map((interview, index) => (
                <tr key={index}>
                  <td className="p-2 border">{interview.candidateEmail}</td>
                  <td className="p-2 border">{interview.role}</td>
                  <td className="p-2 border">{interview.deadline}</td>
                  <td className="p-2 border">{interview.interview_status}</td>
                  <td className="p-2 border">{interview.status}</td>
                  <td className="p-2 border">{interview.verdict}</td>
                  <td className="p-2 border">{interview.rating}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DashboardCompany;
