import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ExamProvider } from './context/ExamContext';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';

// Student Pages
import LoginPage from './pages/LoginPage';
import WaitingPage from './pages/WaitingPage';
import ExamPage from './pages/ExamPage';
import CompletionPage from './pages/CompletionPage';

// Admin Pages
import AdminLoginPage from './admin/pages/LoginPage';
import Dashboard from './admin/pages/Dashboard';
import SubjectsPage from './admin/pages/SubjectsPage';
import QuestionPoolsPage from './admin/pages/QuestionPoolsPage';
import QuestionsPage from './admin/pages/QuestionsPage';
import ExamMatricesPage from './admin/pages/ExamMatricesPage';
import ExamSessionsPage from './admin/pages/ExamSessionsPage';
import ExamSessionDetailPage from './admin/pages/ExamSessionDetailPage';
import ReportsPage from './admin/pages/ReportsPage';
import AdminLayout from './admin/components/layout/AdminLayout';
import { ProtectedRoute } from './admin/components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Student Routes */}
        {/* Student Routes */}
        <Route
          element={
            <ExamProvider>
              <Outlet />
            </ExamProvider>
          }
        >
          <Route path="/" element={<LoginPage />} />
          <Route path="/waiting" element={<WaitingPage />} />
          <Route path="/exam" element={<ExamPage />} />
          <Route path="/completion" element={<CompletionPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <AdminAuthProvider>
              <Routes>
                {/* Public admin route */}
                <Route path="login" element={<AdminLoginPage />} />

                {/* Protected admin routes */}
                <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route
                      path="subjects"
                      element={<SubjectsPage />}
                    />
                    <Route path="question-pools" element={<QuestionPoolsPage />} />
                    <Route path="questions" element={<QuestionsPage />} />
                    <Route path="exam-matrices" element={<ExamMatricesPage />} />
                    <Route path="exam-sessions" element={<ExamSessionsPage />} />
                    <Route path="exam-sessions/:id" element={<ExamSessionDetailPage />} />
                    <Route path="reports" element={<ReportsPage />} />
                    <Route index element={<Navigate to="dashboard" replace />} />
                  </Route>
                </Route>
              </Routes>
            </AdminAuthProvider>
          }
        />

        {/* Redirect /admin to /admin/dashboard */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
