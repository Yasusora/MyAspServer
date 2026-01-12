### ASP.NET + React Full-Stack Pet Project
## Blog project with real time chat, authorization and CRUD operations.

## 🚀 Demo
Frontend: http://localhost:3000

Backend API: http://localhost:5000

SignalR Hub: ws://localhost:5000/chatHub

## 📋 Functionality
🔐 Authentication & Authorization
JWT tokens for secure access

User Registration/Login

Automatic token refresh

Role model (User/Admin)

## 💬 Real-time Chat
Instant messaging via SignalR

List of online users

Message history

Connection/disconnection notifications

## 📝 Content Management
Creating, editing, and deleting articles

Commenting on articles

Tags and categories

View statistics

## 🛠 Tech stack
Backend (ASP.NET Core)
ASP.NET Core Web API - RESTful API

Entity Framework Core - ORM for working with databases

SignalR - Real-time communication

JWT Bearer Authentication - Authentication

Identity Framework - User Management

SQL Server / SQLite - Database

AutoMapper - DTO Mapping

Frontend (React 18 + TypeScript)
React 18 - UI Library

# Structure:
```markdown
<tag>
MyAspServer/ (on GitHub: ~3 MB)
├── Backend/ // MyAspServer
│ ├── MyAspServer/
│ │ ├── Controllers/
│ │ ├── Models/
│ │ └── Program.cs
│ └── MyAspServer.csproj
└── Frontend/ 
└── blog-test-frontend/ 
├── package.json 
├── package-lock.json 
└── src/ 

<tag>
```
## Packages used
Microsoft.AspN 2.2.4
Microsoft.AspNetCore.Authentication.JwtBearer 8.0.0
Microsoft.AspNetCore.Identity.EntityFrameworkCore 8.0.0
Microsoft.AspNetCore.Mvc.Core 2.3.0
Microsoft.AspNetCore.SignalR.Core 1.2.0
Microsoft.EntityFrameworkCore 9.0.0
Microsoft.EntityFrameworkCore.SqlServer 9.0.0
Microsoft.Extensions.Identity.Core 10.0.1
Microsoft.IdentityModel.Tokens 8.15.0
System.IdentityModel.Tokens.Jwt 8.15.0

#Start! 
Build the backend: MyAspServer.sln
Build the frontend: install node.js
Run the frontend: npm start
Run the backend

## Scr
<img width="1840" height="900" alt="image" src="https://github.com/user-attachments/assets/34cf288c-c4f0-4d1b-b988-680098ce8b60" />
<img width="1850" height="922" alt="image" src="https://github.com/user-attachments/assets/6c12c355-984a-4c2e-a260-ba7e5b897d91" />
<img width="1822" height="930" alt="image" src="https://github.com/user-attachments/assets/4eaf190e-3dab-463e-a418-c7a0786f48dd" />
<img width="1844" height="918" alt="image" src="https://github.com/user-attachments/assets/5dde290c-eb79-4877-960d-b3e61c64fa73" />


Check the connection at http://localhost:5000 ; you'll get a 404 error in f12 - that means the connection is established.
Go back to http://localhost:3000 and use it!

I recommend setting up appsettings.json for private encryption.

P.S. If something doesn't work, it's React's fault; I only needed it for testing.
