import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import { db } from '../../config/firebaseConfig';
import { useUser } from '../../context/UserContext';
import { collection, addDoc ,query, where, getDocs} from 'firebase/firestore';

interface InterviewRow {
    candidateEmail: string;
    jobDesc: string;
    role: string;
    skills: string;
    pointers: string;
    deadline: string;
  }
  
  const DashboardCompany: React.FC = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [interviews, setInterviews] = useState<any[]>([]);
    const [parsedData, setParsedData] = useState<InterviewRow[]>([]);
    const [selectedFileName, setSelectedFileName] = useState<string>('');
    const {user,login}= useUser();

    const getCompanyNameByEmail = async () => {
        const companyRef = collection(db, 'company_users');
        const querySnapshot = await getDocs(query(companyRef, where("email", "==", user?.email)));
        const companyDoc = querySnapshot.docs[0];
        return companyDoc ? companyDoc.data().companyName : null;  // return the company name if found
      };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
  
      setSelectedFileName(file.name);
  
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results: Papa.ParseResult<any>) => {
          const data = results.data.map((row) => ({
            candidateEmail: row['candidate email'],
            jobDesc: row['job desc'],
            role: row['role'],
            skills: row['skills'],
            pointers: row['pointers'],
            deadline: row['deadline'],
          }));
          setParsedData(data);
        },
      });
    };
  
    const handleSubmitToDatabase = async () => {
      const interviewsRef = collection(db, 'interviews_request');
      for (const row of parsedData) {
        const companyName = await getCompanyNameByEmail();
        if (companyName) {
            const interviewData = {
              candidateEmail: row.candidateEmail,
              jobDesc: row.jobDesc,
              role: row.role,
              skills: row.skills,
              pointers: row.pointers,
              deadline: row.deadline,
              companyName: companyName, // Add company name
            };
            await addDoc(interviewsRef, interviewData);
          }
      }
      setParsedData([]);
      setSelectedFileName('');
      fetchInterviews();
    };
  
    const fetchInterviews = async () => {
        const interviewsRef = collection(db, 'interviews_request');
        const companyName = await getCompanyNameByEmail();  // Replace with dynamic value or state
        if (!companyName) {
            console.error('No company found for this email.');
            return;
          }      
        const q = query(interviewsRef, where("companyName", "==", companyName));
        
        const querySnapshot = await getDocs(q);
        const interviewsData = querySnapshot.docs.map(doc => doc.data());
        setInterviews(interviewsData);
    };
  
    useEffect(() => {
      fetchInterviews();
    }, []);
  
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Company Dashboard</h1>
  
        {/* CSV Upload Button */}
        <div className="mb-4 flex items-center gap-3">
          <label
            htmlFor="csvUpload"
            className="cursor-pointer inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            📄 Choose CSV File
          </label>
          <input
            id="csvUpload"
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          {selectedFileName && (
            <span className="text-gray-700 text-sm">{selectedFileName}</span>
          )}
        </div>
  
        {/* CSV Preview */}
        {parsedData.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">CSV Preview</h2>
  
            {/* Desktop Table */}           
            {/* Desktop Table */}
            <div className="border border-gray-300 mb-4 overflow-hidden rounded hidden md:block">
            <table className="w-full table-fixed border-collapse">
                <thead className="bg-gray-100">
                <tr>
                    <th className="p-2 border w-1/5">Candidate Email</th>
                    <th className="p-2 border w-1/5">Job Desc</th>
                    <th className="p-2 border w-1/5">Role</th>
                    <th className="p-2 border w-1/5">Skills</th>
                    <th className="p-2 border w-1/5">Pointers</th>
                    <th className="p-2 border w-1/5">Deadline</th>
                </tr>
                </thead>
            </table>

            {/* Scrollable Body */}
            <div className="max-h-40 overflow-y-auto">
                <table className="w-full table-fixed border-collapse">
                <tbody>
                    {parsedData.map((item, index) => (
                    <tr key={index}>
                        <td className="p-2 border">{item.candidateEmail}</td>
                        <td className="p-2 border">{item.jobDesc}</td>
                        <td className="p-2 border">{item.role}</td>
                        <td className="p-2 border">{item.skills}</td>
                        <td className="p-2 border">{item.pointers}</td>
                        <td className="p-2 border">{item.deadline}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            </div>
            </div>
            {/* Mobile List */}
            <div className="md:hidden space-y-2 mb-4">
              {parsedData.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="border p-3 rounded shadow-sm bg-white"
                >
                  <p>
                    <span className="font-semibold">Candidate Email:</span>{' '}
                    {item.candidateEmail}
                  </p>
                  <p>
                    <span className="font-semibold">Job Desc:</span> {item.jobDesc}
                  </p>
                  <p>
                    <span className="font-semibold">Roll:</span> {item.role}
                  </p>
                  <p>
                    <span className="font-semibold">Skills:</span> {item.skills}
                  </p>
                  <p>
                    <span className="font-semibold">Pointers:</span>{' '}
                    {item.pointers}
                  </p>
                  <p>
                    <span className="font-semibold">Deadline:</span>{' '}
                    {item.deadline}
                  </p>
                </div>
              ))}
  
              {parsedData.length > 3 && (
                <p className="text-sm text-gray-500">
                  Showing first 3 rows. Please scroll on desktop view to see more.
                </p>
              )}
            </div>
  
            <button
              onClick={handleSubmitToDatabase}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Submit to Database
            </button>
          </div>
        )}
  
        {/* Interviews List */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Interviews List</h2>
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Candidate Email</th>
                  <th className="p-2 border">Job Desc</th>
                  <th className="p-2 border">Role</th>
                  <th className="p-2 border">Skills</th>
                  <th className="p-2 border">Pointers</th>
                  <th className="p-2 border">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview.id}>
                    <td className="p-2 border">{interview.candidateEmail}</td>
                    <td className="p-2 border">{interview.jobDesc}</td>
                    <td className="p-2 border">{interview.role}</td>
                    <td className="p-2 border">{interview.skills}</td>
                    <td className="p-2 border">{interview.pointers}</td>
                    <td className="p-2 border">{interview.deadline}</td>
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