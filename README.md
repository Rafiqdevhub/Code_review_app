# AI Code Review Agent 🤖

An intelligent code analysis platform powered by AI that helps developers write better, safer, and more maintainable code through instant reviews, security analysis, and intelligent suggestions.

![AI Code Review Agent](https://img.shields.io/badge/AI-Powered-blue) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-blue) ![Vite](https://img.shields.io/badge/Vite-5.4.10-green)

## ✨ Features

### 🔍 **Smart Code Analysis**

- **Multi-language support**: JavaScript, TypeScript, Python, Java, C#, C++, Go, Rust, PHP, Ruby
- **Static code analysis** with complexity metrics and performance insights
- **Real-time feedback** with quality scores and maintainability ratings
- **Code statistics** including lines, functions, classes, and dependencies

### 🛡️ **Security Scanning**

- **Vulnerability detection** with OWASP compliance checks
- **Dependency scanning** for known security issues
- **Security scoring** with detailed remediation suggestions
- **Risk assessment** with priority-based issue classification

### 🧠 **AI Chat Assistant**

- **Interactive conversations** about code quality and best practices
- **Contextual explanations** for detected issues and suggestions
- **Multi-threaded discussions** with conversation history
- **Instant help** for programming questions and code improvements

### 📊 **Comprehensive Reports**

- **Quality metrics** including readability, maintainability, and complexity
- **Issue categorization** by severity (Critical, High, Medium, Low)
- **Performance insights** with optimization recommendations
- **Visual dashboards** with progress tracking and trend analysis

### 🚀 **Modern User Experience**

- **Drag & drop file upload** with support for multiple files
- **Code editor** with syntax highlighting and line numbers
- **Responsive design** optimized for desktop and mobile
- **Real-time status indicators** and loading states

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router DOM
- **Build Tool**: Vite with hot module replacement
- **Code Quality**: ESLint, Prettier
- **Backend Integration**: RESTful API with Node.js/LangChain

## 📖 Usage Guide

### 1. **Code Review Analysis**

**Upload Files**:

- Navigate to the Code Review page
- Drag and drop your code files or click to browse
- Supported formats: `.js`, `.ts`, `.py`, `.java`, `.cs`, `.cpp`, `.go`, `.rs`, `.php`, `.rb`

**Manual Code Entry**:

- Switch to the Code Editor tab
- Select your programming language
- Paste or type your code directly
- Set a filename for better analysis context

**Run Analysis**:

- Click "Run Analysis" to start the AI review process
- View results in categorized tabs: Issues, Metrics, Security
- Get detailed explanations and improvement suggestions

### 2. **AI Chat Assistant**

**Start a Conversation**:

- Go to the AI Chat page
- Click "New Conversation" to create a thread
- Ask questions about code quality, security, or best practices

**Interactive Features**:

- **Multi-turn conversations** with context retention
- **Code-specific questions** with syntax highlighting
- **Copy responses** for documentation
- **Thread management** with conversation history

### 3. **Understanding Reports**

**Quality Metrics**:

- **Readability**: Code clarity and naming conventions
- **Maintainability**: Ease of modification and extension
- **Complexity**: Cyclomatic complexity and nesting levels
- **Performance**: Optimization opportunities and bottlenecks

**Security Analysis**:

- **Vulnerability Score**: Overall security rating (0-100)
- **Risk Categories**: Authentication, injection, XSS, etc.
- **Priority Levels**: Critical issues requiring immediate attention
- **Remediation Steps**: Actionable fix suggestions

## 🏗️ Architecture

### Frontend Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn/ui components
│   ├── CodeEditor.tsx  # Code input and display
│   ├── FileUpload.tsx  # File handling component
│   └── ResultsDisplay.tsx # Analysis results
├── pages/              # Main application pages
│   ├── Home.tsx        # Landing page with features
│   ├── CodeReview.tsx  # Code analysis interface
│   └── AiChat.tsx      # Chat assistant interface
├── services/           # API integration layer
│   └── api.ts          # Backend communication
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── App.tsx             # Main application component
```

### API Integration

The frontend communicates with a Node.js/LangChain backend through RESTful endpoints:

- **`POST /api/analyze`** - Submit code for analysis
- **`POST /api/chat`** - Send messages to AI assistant
- **`GET /api/health`** - Check backend status
- **`POST /api/upload`** - Upload files for analysis

## 🧪 Development

### Available Scripts

```bash
# Development server with hot reload
npm run dev

# Production build
npm run build

# Development build (with source maps)
npm run build:dev

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Code Quality

The project includes comprehensive linting and formatting:

- **ESLint**: Code quality and consistency
- **TypeScript**: Type safety and better developer experience
- **Prettier**: Automated code formatting
- **Husky**: Pre-commit hooks (if configured)

### Environment Variables

```env
# Backend API URL
VITE_API_URL=http://localhost:5000

# Enable debug logging
VITE_API_DEBUG=true

# API request timeout (ms)
VITE_API_TIMEOUT=30000
```

## 🔧 Configuration

### Tailwind CSS

Custom theme configuration in `tailwind.config.ts` with:

- Custom color palette
- Extended component variants
- Responsive breakpoints
- Animation utilities

### Vite Configuration

Optimized build settings in `vite.config.ts`:

- Path aliases (`@/` for `src/`)
- Development server proxy
- Build optimizations
- Environment variable handling

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 🙏 Acknowledgments

- **Radix UI** for accessible component primitives
- **Tailwind CSS** for utility-first styling
- **Lucide React** for beautiful icons
- **Vite** for fast development experience
- **React Query** for efficient data fetching

## 📞 Support

For questions, issues, or contributions:

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Check the integration guide in `README_API_INTEGRATION.md`
- **Community**: Join discussions in the project repository

---

**Transform your code with AI intelligence. Write better, safer, and more maintainable code today!** 🚀
