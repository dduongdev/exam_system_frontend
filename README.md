# Hệ Thống Thi Trực Tuyến - Frontend

A professional online exam system frontend built with React, Vite, and TailwindCSS for educational testing.

## 🚀 Features

- ✅ Student login with access code
- ✅ Multiple question types (MCQ + True/False groups)
- ✅ Real-time countdown timer with auto-submit
- ✅ Question navigator with visual status
- ✅ Auto-save to localStorage every 30 seconds
- ✅ Submit confirmation with statistics
- ✅ Professional, minimalist UI design
- ✅ Page refresh protection

## 🛠️ Tech Stack

- React 18 + Vite
- TailwindCSS
- React Router DOM
- Axios
- Context API

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 🎯 Usage

1. **Login**: Enter any access code (demo uses mock data)
2. **Take Exam**: Answer MCQ and True/False questions
3. **Navigate**: Use buttons or click question numbers
4. **Submit**: Review stats and confirm submission

## 🔧 Configuration

Create `.env` file:

```
VITE_API_URL=http://localhost:3000
```

## 📱 Screens

- **Login Page** - Access code authentication
- **Exam Page** - Two-column layout with questions and navigator
- **Completion Page** - Success confirmation

## 🎨 Design

- **Colors**: Blue (#1d4ed8), Green, Orange, Red, Gray scale
- **Font**: Inter
- **Style**: Flat, minimalist, professional

## 🔗 API Integration

Ready for backend integration. API endpoints expected:

```
POST /student-exams/login
POST /student-exams/:id/start
POST /student-exams/:id/submit
```

## 📄 License

MIT
