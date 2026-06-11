import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { TrackPage } from './pages/TrackPage'
import { VersionPage } from './pages/VersionPage'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/track/:trackId" element={<TrackPage />} />
        <Route path="/track/:trackId/:version" element={<VersionPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}
