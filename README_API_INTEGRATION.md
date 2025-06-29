# AI Code Review Agent - Frontend

A modern, responsive React frontend for the AI Code Review Agent powered by LangChain and Google Gemini. This application provides an intuitive interface for code analysis, AI-powered reviews, and interactive chat with the AI assistant.

## 🌟 Features

### Code Review Interface

- **File Upload Support**: Upload multiple code files (up to 10 files, 5MB each)
- **Manual Code Input**: Type or paste code directly with syntax highlighting
- **Multi-Language Support**: 25+ programming languages supported
- **Real-time Analysis**: Get instant AI-powered code reviews
- **Detailed Results**: Comprehensive analysis with issues, suggestions, and metrics

### AI Chat Interface

- **Interactive Chat**: Natural language conversation with AI assistant
- **Thread Management**: Multiple conversation threads with history
- **Context Awareness**: AI understands your code and previous conversations
- **Persistent History**: Conversations saved locally

### Modern UI/UX

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme detection
- **Accessibility**: WCAG compliant with keyboard navigation
- **Professional Design**: Clean, modern interface with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or bun package manager
- **Backend API**: You need the [Langchain-With-Node.js](https://github.com/Rafiqdevhub/Langchain-With-Node.js) backend running

### Backend Setup (Required)

1. **Clone and set up the backend**:

   ```bash
   git clone https://github.com/Rafiqdevhub/Langchain-With-Node.js.git
   cd Langchain-With-Node.js
   npm install
   ```

2. **Configure environment variables**:

   ```bash
   cp .env.example .env
   # Add your Google AI API key
   GOOGLE_API_KEY=your_google_api_key_here
   ```

3. **Start the backend server**:
   ```bash
   npm run dev
   ```
   The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install dependencies**:

   ```bash
   npm install
   # or
   bun install
   ```

2. **Configure environment**:

   ```bash
   cp .env.example .env
   ```

   The default configuration points to `http://localhost:5000` (backend)

3. **Start the development server**:

   ```bash
   npm run dev
   # or
   bun dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:8080`

## 🔧 Configuration

### Environment Variables

| Variable           | Default                 | Description              |
| ------------------ | ----------------------- | ------------------------ |
| `VITE_API_URL`     | `http://localhost:5000` | Backend API base URL     |
| `VITE_API_DEBUG`   | `true`                  | Enable API debugging     |
| `VITE_API_TIMEOUT` | `30000`                 | API request timeout (ms) |

### Production Configuration

For production deployment, update your `.env` file:

```env
VITE_API_URL=https://your-backend-domain.com
VITE_API_DEBUG=false
```

## 📖 Usage Guide

### Code Review Workflow

1. **Upload Files or Enter Code**:

   - Drag & drop files or use the file picker
   - Or paste code directly in the editor
   - Supports JavaScript, TypeScript, Python, Java, C++, and more

2. **Run Analysis**:

   - Click "Analyze Code" button
   - Wait for AI processing (usually 10-30 seconds)

3. **Review Results**:
   - **Summary**: Overall code quality score and statistics
   - **Issues**: Detailed list of bugs, warnings, and suggestions
   - **Metrics**: Code complexity, maintainability scores
   - **Security**: Security vulnerabilities and recommendations

### AI Chat Features

1. **Start Conversation**:

   - Click "Chat with AI" in navigation
   - Ask questions about code, programming concepts, or get explanations

2. **Thread Management**:

   - Create multiple conversation threads
   - Switch between different topics
   - All conversations are saved locally

3. **Context-Aware Assistance**:
   - AI remembers your previous messages
   - Can reference code you've analyzed
   - Provides personalized suggestions

## 🏗️ Architecture

### Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Lucide React** for icons
- **React Router** for navigation

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── CodeEditor.tsx  # Code input and editing
│   ├── FileUpload.tsx  # File upload handling
│   └── ResultsDisplay.tsx # Analysis results
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page
│   ├── CodeReview.tsx  # Code analysis interface
│   └── AiChat.tsx      # Chat interface
├── services/           # API and external services
│   └── api.ts          # Backend API client
├── hooks/              # Custom React hooks
├── lib/                # Utilities and helpers
└── App.tsx             # Main application component
```

## 🔌 API Integration

The frontend integrates with the following backend endpoints:

### Code Analysis

- `POST /api/ai/review-text` - Analyze code text
- `POST /api/ai/review-files` - Analyze uploaded files
- `GET /api/ai/languages` - Get supported languages
- `GET /api/ai/guidelines` - Get review guidelines

### Chat

- `POST /api/ai/chat` - Send message to AI
- Thread management handled client-side

### Health Check

- `GET /` - API status and information
- `GET /health` - Health check endpoint

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Dependencies
npm install          # Install dependencies
npm update          # Update dependencies
```

### Code Quality

- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting (via ESLint)
- **Git Hooks**: Pre-commit checks

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Deployment Options

1. **Vercel** (Recommended):

   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**:

   - Connect your Git repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **Static Hosting**:
   - Build the project: `npm run build`
   - Upload the `dist` folder to your hosting provider

### Environment Variables for Production

Make sure to set the correct `VITE_API_URL` pointing to your production backend.

## 🔍 Troubleshooting

### Common Issues

**"API connection failed"**

- Ensure the backend is running on `http://localhost:5000`
- Check that the backend has the correct CORS configuration
- Verify the `VITE_API_URL` in your `.env` file

**"Analysis not working"**

- Verify the backend has a valid `GOOGLE_API_KEY` configured
- Check the browser console for API errors
- Ensure uploaded files are within size limits (5MB per file)

**"Chat not responding"**

- Check network connectivity
- Verify the backend API is responding at `/api/ai/chat`
- Look for rate limiting messages in the backend logs

### Getting Help

1. Check the browser console for error messages
2. Verify the backend is running and accessible
3. Review the backend logs for API errors
4. Ensure all environment variables are properly set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is part of the AI Code Review Agent system. See the main repository for license information.

## 🔗 Related Projects

- **Backend API**: [Langchain-With-Node.js](https://github.com/Rafiqdevhub/Langchain-With-Node.js)
- **Documentation**: See backend repository for full API documentation

---

Built with ❤️ using React, TypeScript, and modern web technologies.
