# 🚀 Job Finder - AI-Powered Resume Matching

**Live Demo**: https://job-finder-vgny.vercel.app  
**API Documentation**: https://job-finder-obg3.onrender.com/docs

An intelligent job finder application that analyzes your resume and matches you with relevant job opportunities using AI and multiple job search APIs.

## ✨ Features

- 🤖 **AI-Powered Resume Analysis** - Uses BERT-based NER for skill extraction
- 🔍 **Multi-Source Job Search** - Searches RapidAPI, DuckDuckGo, and SerpAPI
- 📄 **File Support** - Supports PDF and DOCX resume formats
- 🌍 **Location-Based** - Filter jobs by location or remote work
- ⚡ **Real-Time Results** - Get up to 100+ job matches instantly
- 📱 **Responsive Design** - Works on all devices

## 🏗️ Architecture

### Backend (FastAPI)
- **Resume Parser**: Extracts job titles, skills, and personal info
- **Job Search Engine**: Integrates multiple APIs for comprehensive results
- **AI Analysis**: Uses transformers for intelligent matching

### Frontend (React + Vite)
- **Modern UI**: Built with Tailwind CSS
- **File Upload**: Drag-and-drop resume upload
- **Results Display**: Interactive job cards with apply links

## 🚀 Quick Start

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/krishdod/Job-Finder.git
   cd Job-Finder/backend
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set environment variables**
   ```bash
   # Create .env file
   RAPIDAPI_KEY=your_rapidapi_key
   SERPAPI_KEY=your_serpapi_key
   ENVIRONMENT=development
   ```

4. **Run the server**
   ```bash
   python start.py
   ```

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd Frontend_new/vite-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set environment variables**
   ```bash
   # Create .env file
   VITE_API_BASE=http://localhost:8000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🌐 Deployment

### Backend (Render)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

1. Fork this repository
2. Create a new Web Service on Render
3. Connect your GitHub repository
4. Set environment variables in Render dashboard
5. Deploy with build command: `pip install -r requirements.txt`
6. Start command: `python start.py`

### Frontend (Vercel)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/krishdod/Job-Finder)

1. Fork this repository
2. Import project to Vercel
3. Set `VITE_API_BASE` to your Render backend URL
4. Deploy automatically

## 🔧 Configuration

### Required API Keys

1. **RapidAPI Key** - Get from [RapidAPI JSearch](https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch)
2. **SerpAPI Key** - Get from [SerpAPI](https://serpapi.com/)

### Environment Variables

#### Backend (.env)
```env
RAPIDAPI_KEY=your_rapidapi_key_here
SERPAPI_KEY=your_serpapi_key_here
ENVIRONMENT=production
```

#### Frontend (.env)
```env
VITE_API_BASE=https://your-backend-url.onrender.com
```

## 📊 API Endpoints

### Health Check
```http
GET /health
```

### Job Search
```http
POST /search-jobs
Content-Type: multipart/form-data

Parameters:
- resume: File (PDF/DOCX)
- location: String (optional, default: "United States")  
- limit: Integer (optional, default: 50)
```

### API Documentation
```http
GET /docs
```

## 🔍 How It Works

1. **Resume Upload**: User uploads PDF/DOCX resume
2. **Text Extraction**: Backend extracts text using pdfplumber/docx2txt
3. **AI Analysis**: BERT NER model identifies job titles and skills
4. **Job Search**: Queries multiple APIs with extracted information
5. **Results**: Returns deduplicated, relevant job listings
6. **Display**: Frontend shows results in interactive cards

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **Transformers** - Hugging Face for AI/ML
- **PDFPlumber** - PDF text extraction
- **HTTPX** - Async HTTP client
- **DuckDuckGo Search** - Web scraping for jobs

### Frontend  
- **React 19** - Modern JavaScript framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client

### Deployment
- **Render** - Backend hosting
- **Vercel** - Frontend hosting  
- **GitHub** - Source control

## 🧪 Testing

### Backend Tests
```bash
cd backend
python -m pytest tests/
```

### Frontend Tests
```bash
cd Frontend_new/vite-project
npm test
```

### API Testing
Use the built-in Swagger UI at `/docs` endpoint or test with curl:

```bash
curl -X POST "https://job-finder-obg3.onrender.com/search-jobs" \
  -F "resume=@your_resume.pdf" \
  -F "location=United States" \
  -F "limit=25"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Krish Dodiya**
- GitHub: [@krishdod](https://github.com/krishdod)
- Project: [Job Finder](https://github.com/krishdod/Job-Finder)

## 🙏 Acknowledgments

- Hugging Face for the NER model
- RapidAPI for job search data
- Render and Vercel for hosting
- Open source community

---

**Made with ❤️ by Krish Dodiya**
