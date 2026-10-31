# BizPilot 🚀

> **AI Business Planner for India** — Turn your business idea into a reality with AI-tailored suggestions, structured growth roadmaps, verified government scheme matching, and 24/7 business advice.

---

## 🌟 What BizPilot Is

BizPilot is a full-stack MERN application purpose-built for Indian entrepreneurs:

1. **AI Idea Generator**: Enter your city, state, budget in ₹, interests, and experience level. Get 5–7 tailored business ideas with realistic investment figures, expected monthly revenue ranges, competition/risk analysis, and why each idea thrives in your specific city.
2. **Growth Planner**: Select any idea to generate a structured 4-phase checklist (First 30 Days, Next 3 Months, 6 Months, 1 Year) covering marketing, operations, staffing, and expansion.
3. **Government Scheme Finder**: Search active central and state government schemes (e.g., PMEGP, PM MUDRA, Stand-Up India, PMFME) backed by Google Search grounding with direct links to official government portals.
4. **Business AI Chat**: Practical business advisor supporting English, Hindi, and Hinglish for instant queries on licenses, GST, marketing, and operations.
5. **Mentor Ecosystem**: Aspiring entrepreneurs can connect with verified industry mentors; professionals can apply to become mentors subject to admin verification.
6. **Role-Based Admin Panel**: Secure dashboard to manage users, verify/revoke mentor applications, and curate the government schemes database.

---

## 🛠️ Tech Stack

### Backend
- **Node.js** (v20+) & **Express.js** (v5)
- **MongoDB** & **Mongoose** (v8)
- **@google/genai** (Gemini 2.5 Flash with structured outputs and Google Search grounding)
- **JSON Web Tokens (JWT)** & **bcryptjs** (10-round salted password hashing)
- **Multer** & **Cloudinary** (file uploads)
- **CORS**, **dotenv**, **colors**

### Frontend
- **React 18** + **Vite**
- **Tailwind CSS v3** (Plus Jakarta Sans typography, custom design system)
- **Redux Toolkit** (Global authentication state)
- **TanStack React Query v5** (Server state management, caching & polling)
- **React Router DOM v7** (Protected nested routes)
- **Lucide React** (Consistent UI iconography)
- **React Hot Toast** (Notifications)

---

## 📁 Folder Structure

```
bizpilot/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   └── AdminSidebar.jsx
│   │   │   ├── common/
│   │   │   │   ├── Badge.jsx
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Loader.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   └── Tabs.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── Navbar.jsx
│   │   │   ├── PrivateComponent.jsx
│   │   │   └── ProfileForm.jsx
│   │   ├── features/
│   │   │   ├── auth/authSlice.js
│   │   │   └── store.js
│   │   ├── pages/
│   │   │   ├── admin/
│   │   │   │   ├── AdminAllUsersPage.jsx
│   │   │   │   ├── AdminDashboardPage.jsx
│   │   │   │   ├── AdminMentorsPage.jsx
│   │   │   │   ├── AdminSchemesPage.jsx
│   │   │   │   └── VerificationModal.jsx
│   │   │   ├── ai/
│   │   │   │   ├── AiChatPage.jsx
│   │   │   │   ├── AiHubPage.jsx
│   │   │   │   ├── GrowthPlannerPage.jsx
│   │   │   │   ├── IdeaGeneratorPage.jsx
│   │   │   │   └── SchemeFinderPage.jsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   └── RegisterPage.jsx
│   │   │   ├── dashboard/
│   │   │   │   └── UserDashboardPage.jsx
│   │   │   ├── mentor/
│   │   │   │   └── MentorApplicationPage.jsx
│   │   │   └── LandingPage.jsx
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── aiService.js
│   │   │   ├── authService.js
│   │   │   ├── mentorService.js
│   │   │   ├── planService.js
│   │   │   └── schemeService.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/
│   ├── config/
│   │   └── dbConfig.js
│   ├── controllers/
│   │   ├── admin/adminController.js
│   │   ├── ai/aiController.js
│   │   ├── auth/authController.js
│   │   ├── mentor/mentorController.js
│   │   ├── plan/planController.js
│   │   └── scheme/schemeController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── cloudinaryMiddleware.js
│   │   ├── errorHandler.js
│   │   └── fileUploadMiddleware.js
│   ├── models/
│   │   ├── chatMessageModel.js
│   │   ├── growthPlanModel.js
│   │   ├── ideaModel.js
│   │   ├── ideaRequestModel.js
│   │   ├── mentorModel.js
│   │   ├── schemeCacheModel.js
│   │   ├── schemeModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── aiRoutes.js
│   │   ├── authRoutes.js
│   │   ├── mentorRoutes.js
│   │   ├── planRoutes.js
│   │   └── schemeRoutes.js
│   ├── services/
│   │   └── geminiService.js
│   ├── Dockerfile
│   └── server.js
├── uploads/
│   └── .gitkeep
├── .dockerignore
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── package.json
├── README.md
└── seed.js
```

---

## 🔑 Environment Variables

### Root `.env` (Server)
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bizpilot
JWT_SECRET=your_jwt_secret_key_here
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=rootpassword
MONGO_DATABASE=bizpilot
```

> ⚠️ **Important**: 
> - Add your Gemini API key from [Google AI Studio](https://aistudio.google.com/) into `GEMINI_API_KEY`.
> - Ensure MongoDB is running locally or provide a remote MongoDB Atlas connection URI in `MONGO_URI`.

### Client `.env` (`client/.env`)
```env
VITE_API_URL=http://localhost:5000
```

---

## 🚀 How to Run

### Method 1: Local Development

1. **Install root dependencies**:
   ```bash
   npm install
   ```

2. **Install client dependencies & build**:
   ```bash
   npm install --prefix client --include=dev
   ```

3. **Seed Database** (Ensure MongoDB is running first):
   ```bash
   npm run seed
   ```

4. **Start Backend Server**:
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

5. **Start Frontend Dev Server** (in a separate terminal):
   ```bash
   npm run dev --prefix client
   # Frontend runs on http://localhost:5173
   ```

6. **Single-command production build**:
   ```bash
   npm run setup
   npm start
   # Server serves the built client statically on http://localhost:5000
   ```

---

### Method 2: Docker Compose

Start the full stack (MongoDB + Express Backend + Nginx Client) with a single command:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000
- **MongoDB**: localhost:27017

---

## 👤 Seeded Login Credentials

Run `npm run seed` to populate demo accounts:

| Role | Email | Password | Details |
|---|---|---|---|
| **ADMIN** | `admin@example.com` | `Admin@123` | Full access to `/auth/admin` |
| **USER 1** | `rahul@example.com` | `Password@123` | Indore, MP |
| **USER 2** | `priya@example.com` | `Password@123` | Bhopal, MP |
| **USER 3** | `amit@example.com` | `Password@123` | Jabalpur, MP |
| **USER 4** | `sneha@example.com` | `Password@123` | Indore, MP |
| **MENTOR 1** | `mentor1@example.com` | `Password@123` | Verified (Gupta Business Consultancy) |
| **MENTOR 2** | `mentor2@example.com` | `Password@123` | Verified (Agarwal Digital Solutions) |

---

## 🛡️ License

MIT License. Built for Indian Entrepreneurs.

