About the Project
VHire is a job hiring web application that connects recruiters with job seekers. 
The platform streamlines the hiring process with a user-friendly interface, real-time updates, and organized job listings.

✨ Features
User Authentication – Secure login and registration for candidates, companies, and admins.
Company Registration – Companies can register, post job openings, and view a filtered list of candidates.
Candidate Management – Companies can shortlist and access candidate profiles and resumes.
Admin Dashboard – Admins can manage users, companies, and schedule interviews.
Interview Scheduling – Admin can schedule interviews and assign interviewers.
Live Code Editor Integration – In-browser coding rounds powered by a code editor API.
Google Meet Integration – Seamless video interviews using the Google Meet API.
Payment Gateway – Payments handled via company-side payment API.
Interviewer Payment System – Interviewers are paid automatically post-interview.
Notifications – Real-time notifications and updates for interview schedules and application status.
Resume Upload & Profile Management – Candidates can upload resumes and maintain personal profiles.


🛠️ Tech Stack
Frontend: React.js, HTML, CSS, Bootstrap
Backend: Node.js, Express.js
Database: Firebase database
Others: JWT Auth, Cloudinary (for image upload), etc.

🔧 Installation/ Running the Code:
Clone the repo:

1. git clone https://github.com/anuksha11/VHire.git
2. git checkout origin/iteration-2
3. cd vhire-it-1 (change directotry)
4. cd backend     
5. npm install (to install all node modules)
6. npm start (to run the backend)

Open new Terminal(For Running Frontend):
1. cd vhire-it-1 (change directotry)
2. cd vhire-interview-platform
3. npm install (to install all node modules)
4. npm start (to run the frontend)


🚀 Usage
Register as a candiadte or company or interviewer
In company dashboard, company will register,provide company and candidate details to be interviewed.
In candidate dashboard, candiadte will see the interview room ID link
In Interviewer Dashboard, Interview can schedule the meeting for Interview of candidate.

Main Modules Description:

1. Authentication Module
Handles user login, registration, and role-based access (Candidate, Company, Admin). Uses JWT for session management and route protection.

2. Candidate Module
Manage profile and resume.
Receive interview notifications.
Attend interviews via integrated Google Meet.
Participate in coding rounds through embedded code editor.

3. Company Module
Register and log in to post job openings.
Browse and shortlist candidates.
Make payments to schedule interviews.
View interview schedules and results.

4. Admin Module
Manage users (candidates, companies, interviewers).
Approve or reject company registrations.
Assign interviewers and schedule interviews.
Monitor payment status and overall platform activity.

5. Interview Scheduling Module
Schedule interviews between companies and candidates.
Generate Google Meet links for live interviews.
Assign interviewers automatically or manually.
Notify all parties involved (email or in-app notifications).

6. Code Editor Module
Embeds a live coding environment using a third-party API.
Allows interviewers to evaluate coding skills in real time.
Supports multiple programming languages.

7. Payment Module
Integrates a payment gateway (e.g., Razorpay/Stripe).
Companies pay to conduct interviews.
Interviewers are compensated post-interview.
Admin can track all transactions.

8. Notification Module
Sends real-time updates to users (via socket.io or other tech).
Interview schedules, application status, payment confirmations, etc.



