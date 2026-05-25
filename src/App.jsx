import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Sidebar from './components/Sidebar'
import MobileNav from './components/MobileNav'
import ProjectsPage from './pages/ProjectsPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectFormPage from './pages/ProjectFormPage'
import styles from './App.module.css'

function Layout({ children }) {
  return (
    <div className="page-shell">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
      <MobileNav />
    </div>
  )
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
            borderRadius: '10px',
            border: '1px solid #E8E4DC',
            boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: { primary: '#0F8B7A', secondary: 'white' },
          },
        }}
      />

      <Routes>
        <Route path="/" element={<Layout><ProjectsPage /></Layout>} />
        <Route path="/projects/new" element={<Layout><ProjectFormPage /></Layout>} />
        <Route path="/projects/:id" element={<Layout><ProjectDetailPage /></Layout>} />
        <Route path="/projects/:id/edit" element={<Layout><ProjectFormPage /></Layout>} />
        <Route path="*" element={
          <Layout>
            <div className="page-loading" style={{ flexDirection: 'column', gap: 12 }}>
              <p style={{ fontSize: 48, fontFamily: 'Syne' }}>404</p>
              <p style={{ color: 'var(--text-muted)' }}>Page not found</p>
            </div>
          </Layout>
        } />
      </Routes>
    </>
  )
}
