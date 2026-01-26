import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import {Spinner} from './components/Spinner.jsx'

import { Routes, Route } from 'react-router'
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/Home.jsx'))
const SearchPage = lazy(() => import('./pages/Search.jsx'))
const NotFoundPage = lazy(() => import('./pages/404.jsx'))
const JobDetail = lazy(() => import('./pages/Detail.jsx'))

function App() {
  return (
    <>
      <Header />

      <Suspense // Para mostrar contenido de espera mientras carga el componente
        fallback={<Spinner texto="Cargando página..." />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
        </Routes>
      </Suspense>
      <Footer />
    </>
  )
}

export default App
