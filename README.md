
# `equirk`
![Banner GitHub](doc/GitHub%20Banner.png)

**AI-Powered Inclusive Career Development Platform**

Equirk is an AI-powered career development platform that provides personalized guidance for everyone, regardless of ability. Using LLM and Internet Computer Protocol (ICP), it combines personalized career roadmaps with accessibility-first design to democratize career development.

## The Problem

Career platforms exclude people with disabilities and lack personalized guidance. EQUIRK creates an inclusive AI-powered platform using Google Gemini for personalized roadmaps and accessibility-focused job matching on ICP blockchain.

---

## 🧑‍💻 Team

| **Name**                    | **Role**                                 |
|-----------------------------|------------------------------------------|
| Muhammad Karov Ardava Barus | Lead, AI/ML Engineer, Backend Developer  |
| Casta Garneta               | UI/UX Designer                           |
| Farrel Ardya Ghalyndra      | Fullstack Developer                      |
| Putu Padmanaba              | AI/ML Engineer                           |

---

## 🚀 Features

- **🔐 Internet Identity Authentication**: Secure, decentralized authentication using ICP's Internet Identity
- **🤖 AI-Powered Career Roadmaps**: Personalized learning paths generated using Large Language Model
- **♿ Accessibility & Inclusion**: Specialized guidance for users with disabilities and accessibility considerations
- **📄 Resume Analysis**: PDF resume upload and AI-powered text extraction for skill assessment
- **🎯 Intelligent Job Matching**: ML algorithms that match users with suitable career opportunities
- **📊 Skill Level Adaptation**: Customized guidance for beginner, intermediate, and advanced skill levels
- **🌐 Decentralized Frontend**: Frontend deployed as canister on Internet Computer Protocol

---

## 🛠️ Tech Stack

**Frontend:**
- React 19.1.0 with Vite
- Tailwind CSS 4.1.11
- Framer Motion for animations
- React Router DOM for navigation
- PDF.js for resume processing

**Backend:**
- Node.js with Express
- Google Gemini LLM (@langchain/google-genai)
- PDF parsing with pdf-parse
- Multer for file uploads
- Python Flask (for ML recommendation system)

**Machine Learning:**
- Python 3.8+
- Flask for ML API
- Pandas, NumPy for data processing
- Scikit-learn for job matching algorithms

**Blockchain:**
- Internet Computer Protocol (ICP)
- DFX for canister deployment
- Internet Identity for authentication

---

## 📋 Requirements

**System Requirements:**
- Node.js 18+ 
- Python 3.8+
- npm or yarn
- pip (Python package manager)
- DFX SDK (for ICP deployment)

**API Keys Required:**
- Google Gemini API Key (for AI features)

---

## 🚀 How to Run the App

### 1. Clone the Repository
```bash
git clone https://github.com/Ardavaa/equirk.git
cd equirk
```

### 2. Setup Environment Variables
Create `.env` file in the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
# or
GOOGLE_API_KEY=your_gemini_api_key_here
```

### 3. Setup Python Virtual Environment

**Create and activate virtual environment:**
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install Python dependencies
pip install -r backend/requirements.txt
```

### 4. Install Dependencies

**Backend (Node.js):**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 5. Run the Application

**Start Python Flask Recommender (Terminal 1):**
```bash
# Make sure virtual environment is activated
cd backend
python flask_recommender.py
```
Flask recommender will run on `http://localhost:5000`

**Start Node.js Backend Server (Terminal 2):**
```bash
cd backend
node server.js
```
Backend will run on `http://localhost:3001`
Backend will run on `http://localhost:3001`

**Start Frontend Development Server (Terminal 3):**
```bash
cd frontend
npm run dev
```
Frontend will run on `http://localhost:5174`

**Access the Application:**
- Frontend: `http://localhost:5174`
- Node.js Backend: `http://localhost:3001`  
- Flask ML Service: `http://localhost:5000`

### 6. Deploy to Internet Computer (Optional)

**Build Frontend:**
```bash
cd frontend
npm run build
```

**Start DFX and Deploy:**
```bash
dfx start --background
dfx deploy
```

---

## 🔮 Future Work

### Planned Enhancements

**1. Live Job API Integration**
- Integration with live job posting APIs (LinkedIn, Indeed, Glassdoor)
- Real-time CV matching with live job opportunities  
- Automated job recommendation notifications
- Company accessibility rating system

**2. Enhanced Disability Support**
- More comprehensive disability categories and accommodations
- Voice-to-text and text-to-voice integration
- Screen reader optimization improvements
- Keyboard navigation enhancements
- High contrast and font size customization options

**3. Advanced AI Features**
- Multi-language support for global accessibility
- Industry-specific career guidance
- Mentorship matching system
- Skill gap analysis with learning recommendations
- Career progression prediction models

**4. Community Features**
- Peer support groups for different disabilities
- Success stories and testimonials section
- Community-driven job recommendations
- Accessibility advocacy tools

**5. Enhanced Responsive Design**
- Mobile-first approach optimization
- Progressive Web App (PWA) capabilities
- Offline functionality for core features
- Touch-friendly interface improvements
- Cross-device synchronization
- Adaptive layouts for tablets and mobile devices
- Performance optimization for low-bandwidth connections

---

##  License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

## 📞 Support
For questions, issues, or feedback:
- Open an issue on GitHub
- Contact the team through the repository

**Built with ❤️ for accessibility and inclusion by Team Equirk**
