import { BrowserRouter, Route, Routes } from 'react-router'
import { ThemeProvider } from './components/theme-provider'
import Navbar from './components/shared/navbar'
import RegisterPage from './pages/register'
import HomePage from './pages/home'
import LoginPage from './pages/login'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import ProtectedRoute from './components/shared/protected-route'
import { Toaster } from 'sonner'
import CreateProfilePage from './pages/create-profile'
import DashboardPage from './pages/dashboard'
import CreateProjectPage from './pages/create-project'
import ProjectDetailPage from './pages/project-details'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
})

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <Routes>
            <Route path="/" element={<Navbar />}>
              <Route index element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/create-profile" element={<CreateProfilePage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/create-project" element={<CreateProjectPage />} />

                <Route path="/projects/:id" element={<ProjectDetailPage />} />
              </Route>

              <Route path="*" element={<div>404 Not Found</div>} />
            </Route>
          </Routes>

          <Toaster position="bottom-center" richColors />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  )
}

export default App
