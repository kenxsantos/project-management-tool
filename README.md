# 📌 Project Management Tool  

A simple and modern **Project & Task Management System** with drag-and-drop task updates, project tracking, and change logs.  

## 🚀 Overview  
ProManTool helps teams and individuals organize projects and tasks efficiently. It supports authentication, project management, task workflows, and maintains a change log for transparency.  

The frontend is built with Next.js and uses a **Next.js API proxy** to securely communicate with the backend, allowing seamless integration and avoiding CORS issues.


🔗 **Project Link Demo**: [ProManTool](https://promantool.vercel.app/)  
---
## ⬆️ Improvements & Fixes
- Implemented smooth page-load animations to enhance user experience.
- Improve UI design and improved responsiveness across devices.
- Resolved task addition bug, ensuring seamless task creation and accurate state updates.
- Integrated Zustand for state management, enabling optimistic UI updates and faster interactions.
- Add dnd-kit sensors to move task item to different devices.
- Sort the list of projects to the ascending order (latest).

## ⚙️ Tech Stack  
- **Frontend**: Next.js / React, TailwindCSS, Framer Motion, Axios
- **Deployment**: Vercel  

---

## ✨ Features  
- 🔑 **Authentication** – User sign-up & login  
- 📂 **Project Management** – Create & update projects  
- ✅ **Task Management** – Create, assign, and drag-and-drop tasks between statuses (`Todo`, `In Progress`, `Done`)  
- 🕑 **Change Log** – Track updates to tasks and fetch via API  

---
## 📦 Installation & Setup  

### 1️⃣ Clone Repository  
```bash
git clone https://github.com/kenxsantos/project-management-tool.git
cd project-management-tool
```
### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣Configure Environment
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000/api/proxy
API_URL: https://m-backend.dowinnsys.com
```

### 4️⃣ Run Development Server
```bash
npm run dev
```

Your app should now be running on http://localhost:3000. 

