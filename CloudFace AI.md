CloudFace AI

Software Requirements Specification (SRS)

Project Type: Cloud Computing Micro Project
Project Category: AI-Powered Cloud-Based Attendance Management System
Deployment Platform: Vercel
Database & Cloud Backend: Supabase
Primary Development Approach: AI-Assisted Development using Google Antigravity

---

1. Project Overview

1.1 Project Name

CloudFace AI – Cloud-Based Smart Face Attendance Management System

1.2 Project Description

CloudFace AI is a cloud-based attendance management web application designed to automate student attendance using facial verification technology.

Students can register their account, provide their academic information, and enroll their face using their device camera. During attendance, the student opens the attendance scanner, verifies their identity using the camera, and the system automatically records attendance after successful verification.

The system provides separate dashboards for students and administrators. Students can view their attendance status, percentage, and history. Administrators can manage students, monitor daily attendance, view analytics, search records, filter attendance data, and export reports.

The application will use cloud-based infrastructure for hosting, backend services, authentication, and database management.

---

2. Problem Statement

Traditional attendance systems often require manual attendance, paper registers, or manual data entry. These methods can be time-consuming, difficult to manage, and prone to errors.

CloudFace AI aims to provide an automated attendance management solution where student identity verification and attendance recording are handled digitally through a web-based system.

The project also demonstrates the practical use of:

- Cloud Computing
- Web Technologies
- Cloud Databases
- Authentication Systems
- REST APIs
- AI-Assisted Development
- Facial Verification Technology

---

3. Project Objectives

The main objectives of CloudFace AI are:

1. To automate student attendance management.
2. To reduce manual attendance work.
3. To provide a cloud-based attendance system accessible through the web.
4. To provide separate dashboards for students and administrators.
5. To maintain attendance records securely in a cloud database.
6. To prevent duplicate attendance submissions.
7. To provide attendance statistics and analytics.
8. To demonstrate cloud computing concepts in a practical project.
9. To create a modern and professional web application with selected 3D elements.
10. To deploy the application using free-tier cloud services.

---

4. User Roles

The system will have two primary user roles.

4.1 Student

Students can:

- Register an account.
- Login securely.
- Complete their profile.
- Enroll their face using the camera.
- Scan their face for attendance verification.
- View today's attendance status.
- View attendance percentage.
- View attendance history.
- View present and absent statistics.
- Manage their profile.
- Logout.

---

4.2 Administrator

Administrators can:

- Login securely.
- View total registered students.
- View today's present students.
- View today's absent students.
- View attendance statistics.
- Search for students.
- View individual student profiles.
- View individual attendance history.
- Filter attendance by date.
- Manage student records.
- View attendance analytics.
- Export attendance reports.
- Monitor system activity.

---

5. Functional Requirements

FR-01: Student Registration

The system shall allow a student to create an account.

The registration form shall contain:

- Full Name
- Roll Number
- Email Address
- Password
- Class
- Division

The system shall validate required fields before creating the account.

The roll number should be unique according to the selected academic structure.

---

FR-02: Student Login

The system shall allow registered students to login using their credentials.

After successful authentication, the student shall be redirected to the Student Dashboard.

Invalid login attempts shall display an appropriate error message.

---

FR-03: Admin Login

The system shall provide a separate authentication system for administrators.

Only authorized administrators shall access the Admin Dashboard.

---

FR-04: Student Profile

Students shall be able to view their profile information.

The profile shall include:

- Name
- Roll Number
- Email
- Class
- Division
- Registration Date

Students may update allowed profile information.

---

FR-05: Face Enrollment

During registration or profile setup, students shall be able to enroll for face verification using their device camera.

The system shall:

1. Request camera permission.
2. Detect the presence of a face.
3. Capture the required verification data.
4. Complete enrollment after successful processing.

The project should minimize storage of unnecessary raw biometric images and clearly inform users about face-data usage.

---

FR-06: Face Verification for Attendance

Students shall access an attendance scanner.

The system shall:

1. Activate the device camera.
2. Detect a face.
3. Perform the configured identity verification process.
4. Check whether the student is eligible to mark attendance.
5. Prevent duplicate attendance for the same attendance session.
6. Record attendance after successful verification.
7. Display a success or failure message.

---

FR-07: Duplicate Attendance Prevention

The system shall prevent a student from marking attendance multiple times for the same date and attendance session.

Before creating a new attendance record, the system shall check existing records.

If attendance is already recorded, the system shall display:

Attendance Already Marked Today

---

FR-08: Attendance Record

Each attendance record shall contain:

- Attendance ID
- Student ID
- Date
- Check-in Time
- Attendance Status
- Created Timestamp

Possible attendance status:

- Present
- Absent
- Late (optional future feature)

---

FR-09: Student Dashboard

The Student Dashboard shall display:

- Welcome message
- Today's attendance status
- Total Present Days
- Total Absent Days
- Attendance Percentage
- Recent Attendance History
- Attendance Statistics

---

FR-10: Admin Dashboard

The Admin Dashboard shall display:

- Total Students
- Present Students Today
- Absent Students Today
- Attendance Rate
- Recent Attendance Activity
- Student Statistics
- Attendance Charts

---

FR-11: Student Management

Administrators shall be able to:

- View all students.
- Search students.
- Filter students.
- View student profiles.
- View student attendance history.
- Manage student records.

---

FR-12: Attendance History

The system shall provide attendance history.

Students shall only access their own attendance records.

Administrators shall be able to access attendance records of all students.

The history shall support:

- Date filtering
- Searching
- Sorting

---

FR-13: Attendance Analytics

The system shall calculate and display:

- Total Students
- Present Students
- Absent Students
- Attendance Percentage
- Daily Attendance Rate
- Monthly Attendance Statistics

Charts may include:

- Bar Chart
- Line Chart
- Pie/Donut Chart

---

FR-14: Report Export

Administrators should be able to export attendance data.

Supported format for the initial version:

- CSV

Future enhancement:

- PDF Report

---

6. Non-Functional Requirements

NFR-01: Performance

The application should load quickly and provide responsive interactions.

Heavy 3D elements shall not affect dashboard performance.

---

NFR-02: Security

The system shall:

- Use secure authentication.
- Protect API routes.
- Restrict admin-only functionality.
- Validate user input.
- Use environment variables for sensitive credentials.
- Avoid exposing database credentials in frontend code.

---

NFR-03: Privacy

Because facial information is sensitive, the application shall:

- Inform users about camera and face-data usage.
- Request appropriate camera permissions.
- Avoid unnecessary storage of raw face images.
- Limit access to biometric-related information.
- Use the system only for authorized educational/demo purposes.

---

NFR-04: Responsiveness

The website shall work on:

- Desktop computers
- Laptops
- Tablets
- Mobile devices

---

NFR-05: Scalability

The architecture should allow future expansion for:

- Multiple classes
- Multiple divisions
- Multiple teachers
- Multiple attendance sessions
- Multiple institutions

---

7. Technology Stack

Frontend

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

3D and Animation

- Three.js
- React Three Fiber
- Drei
- Framer Motion

3D elements will primarily be used on the Landing Page and selected visual sections.

The dashboards shall remain lightweight and professional.

---

Backend

Next.js will provide backend functionality through:

- Route Handlers
- Server Actions where appropriate
- Secure server-side operations

---

Database

Supabase PostgreSQL

The database will store:

- User information
- Student information
- Attendance records
- Application data

---

Authentication

Supabase Auth

Authentication will manage:

- Registration
- Login
- Logout
- User sessions
- Role-based access

---

Deployment

Vercel

Vercel will host and deploy the Next.js application.

---

8. System Architecture

                    USERS
                      |
                      v
              VERCEL CLOUD PLATFORM
                      |
                      v
                NEXT.JS APPLICATION
                 /              \
                v                v
          FRONTEND UI       BACKEND/APIs
                |                |
                |                v
                |          BUSINESS LOGIC
                |                |
                +--------+-------+
                         |
                         v
                  SUPABASE CLOUD
                 /              \
                v                v
         AUTHENTICATION      POSTGRESQL DB
                                   |
                                   v
                           ATTENDANCE DATA

---

9. Proposed Database Structure

9.1 Profiles Table

Stores general user information.

Fields:

id
full_name
email
role
created_at
updated_at

Role values:

- student
- admin

---

9.2 Students Table

Stores student-specific information.

Fields:

id
profile_id
roll_number
class
division
face_enrolled
created_at
updated_at

---

9.3 Attendance Table

Stores attendance records.

Fields:

id
student_id
attendance_date
check_in_time
status
created_at

Status values:

- present
- absent
- late

---

9.4 Admin Activity Logs Table

Stores important administrator actions.

Fields:

id
admin_id
action
description
created_at

Examples:

- Student Created
- Student Updated
- Attendance Record Viewed
- Report Exported

---

10. API Requirements

Authentication APIs

Register Student

POST /api/auth/register

Login

POST /api/auth/login

Logout

POST /api/auth/logout

---

Student APIs

Get Student Profile

GET /api/student/profile

Update Student Profile

PUT /api/student/profile

Get Student Attendance

GET /api/student/attendance

---

Face Enrollment API

POST /api/face/enroll

Purpose:

Process and store the required enrollment information according to the selected face-verification implementation.

---

Face Attendance Verification API

POST /api/attendance/verify

The backend shall:

1. Verify the request.
2. Identify the authenticated student/session.
3. Check eligibility.
4. Check duplicate attendance.
5. Create the attendance record when verification succeeds.

---

Admin APIs

Get Dashboard Statistics

GET /api/admin/dashboard

Get Students

GET /api/admin/students

Get Attendance Records

GET /api/admin/attendance

Export Attendance

GET /api/admin/export

---

11. Website Pages

Public Pages

1. Landing Page

Features:

- Premium modern design
- Selected 3D cloud elements
- AI-inspired animations
- Project introduction
- Features section
- Technology section
- Call-to-action buttons

---

2. Login Page

Options:

- Student Login
- Admin Login

---

3. Registration Page

Student registration form.

---

4. Privacy and Consent Page

Explains:

- Camera usage
- Face verification purpose
- Attendance data usage

---

12. Student Application Pages

Student Dashboard

Face Enrollment

Attendance Scanner

Attendance History

Attendance Analytics

Profile

---

13. Admin Application Pages

Admin Dashboard

Student Management

Student Details

Attendance Management

Attendance Analytics

Reports and Export

Admin Profile

---

14. Attendance Workflow

STUDENT LOGIN
      |
      v
OPEN ATTENDANCE SCANNER
      |
      v
CAMERA PERMISSION
      |
      v
FACE DETECTED
      |
      v
IDENTITY VERIFICATION
      |
      +------------------+
      |                  |
      v                  v
    FAILED            VERIFIED
      |                  |
      v                  v
SHOW ERROR        CHECK ATTENDANCE
                         |
                 +-------+-------+
                 |               |
                 v               v
          ALREADY MARKED      NOT MARKED
                 |               |
                 v               v
          SHOW STATUS      CREATE RECORD
                                 |
                                 v
                        UPDATE DASHBOARD
                                 |
                                 v
                        SHOW SUCCESS MESSAGE

---

15. UI and Design Requirements

Design Style

The application should have:

- Modern SaaS appearance
- Cloud Computing visual theme
- AI-inspired design
- Glassmorphism where appropriate
- Smooth animations
- Professional typography
- Responsive layout

---

Color Theme

Recommended:

- Deep Blue
- Purple accents
- Cyan highlights
- White and dark backgrounds

The final theme should represent:

☁️ Cloud Computing
🤖 Artificial Intelligence
🔐 Security
📊 Data Analytics

---

16. 3D Design Requirements

3D should be used carefully.

Landing Page 3D Elements

Possible elements:

- Animated cloud infrastructure
- Floating server objects
- Digital face scanning visualization
- Data particles
- Interactive network visualization

The application dashboard should not depend on heavy 3D graphics.

Priority:

FUNCTIONALITY
      ↓
PERFORMANCE
      ↓
USER EXPERIENCE
      ↓
3D VISUALS

---

17. Cloud Computing Concepts Demonstrated

This project demonstrates:

Cloud Hosting

The application is deployed on a cloud hosting platform.

Cloud Database

Attendance data is stored in a cloud PostgreSQL database.

Backend Services

Server-side APIs process application requests.

Authentication as a Service

Cloud authentication services manage users and sessions.

Scalability

The system architecture can support future expansion.

Web-Based Accessibility

Users can access the application through the internet.

---

18. Security Requirements

The system must implement:

- Role-Based Access Control
- Protected Routes
- Secure Authentication
- Database Row-Level Security where applicable
- Environment Variables
- Input Validation
- Duplicate Attendance Prevention

Sensitive keys must never be exposed in frontend code.

---

19. Free Development Requirement

The project must prioritize a ₹0 development workflow.

Preferred services:

- Google Antigravity free access/quota
- GitHub free account
- Vercel free tier
- Supabase free tier
- Open-source JavaScript libraries

The project architecture should avoid paid APIs unless the user explicitly approves them.

Important: Free-tier limits and availability may change. Before final deployment, all services and quotas should be checked again.

---

20. Development Phases

Phase 1 — Planning

- Finalize requirements
- Finalize architecture
- Finalize database design

---

Phase 2 — Project Setup

- Create Next.js application
- Configure TypeScript
- Configure Tailwind CSS
- Configure UI components
- Create folder structure

---

Phase 3 — Supabase Setup

- Create Supabase project
- Configure authentication
- Create database tables
- Configure security policies

---

Phase 4 — Authentication

- Student registration
- Student login
- Admin login
- Protected routes
- Role-based access

---

Phase 5 — Student Module

- Student profile
- Student dashboard
- Attendance history

---

Phase 6 — Face Enrollment

- Camera integration
- Face detection
- Enrollment workflow
- Consent and privacy handling

---

Phase 7 — Attendance System

- Camera scanner
- Verification workflow
- Duplicate prevention
- Attendance record creation

---

Phase 8 — Admin Module

- Admin dashboard
- Student management
- Attendance management
- Search and filters

---

Phase 9 — Analytics and Reports

- Charts
- Statistics
- CSV export

---

Phase 10 — 3D Landing Page

- Three.js integration
- React Three Fiber
- Cloud visualization
- AI animations

---

Phase 11 — Testing

Test:

- Authentication
- Database operations
- APIs
- Attendance workflow
- Duplicate prevention
- Responsive design
- Role permissions

---

Phase 12 — Deployment

- Push code to GitHub
- Configure environment variables
- Connect repository to Vercel
- Deploy application
- Test production version

---

21. Future Enhancements

Possible future features include:

- Teacher accounts
- Multiple institutions
- Multiple classes
- Multiple attendance sessions
- QR backup attendance
- Email notifications
- PDF reports
- Advanced analytics
- Mobile application
- Institution-based management
- Advanced anti-spoofing technology

---

22. Important Development Rule for AI Agent

The AI development agent must follow these rules:

1. Do not rewrite working code unnecessarily.
2. Complete one phase before starting the next phase.
3. Test existing functionality before adding new functionality.
4. Do not remove existing features without permission.
5. Use free and open-source tools whenever possible.
6. Do not introduce paid services without explicit approval.
7. Store secrets only in environment variables.
8. Use secure authentication and database access.
9. Keep the project responsive and mobile-friendly.
10. Prioritize functionality before advanced visual effects.
11. Before making major changes, analyze the existing project structure.
12. Fix errors with minimal changes instead of rebuilding the entire project.

---

23. Project Success Criteria

The project will be considered successfully completed when:

- Students can register and login.
- Administrators can login.
- Student information is stored successfully.
- The face enrollment workflow works according to the selected implementation.
- The attendance verification workflow works for the approved demo/project scope.
- Duplicate attendance is prevented.
- Attendance records are stored in the cloud database.
- Students can view attendance history.
- Administrators can monitor attendance.
- Analytics are displayed.
- Reports can be exported.
- The application is responsive.
- The website includes professional cloud/AI visual elements.
- The application is successfully deployed.
- The complete project operates using approved free-tier services within their available limits.

---

End of Software Requirements Specification

Project Name: CloudFace AI
Project Type: Cloud-Based AI Attendance Management System
Development Method: AI-Assisted Full-Stack Development
Primary Goal: Build a professional cloud computing project using free-tier technologies.