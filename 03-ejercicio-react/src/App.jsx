/* Puedes elegir el nombre que quieras en los componentes */
import Header from './components/Header'
import Footer from './components/Footer'
import {Search} from './pages/Search.jsx'
import {NotFoundPage} from './pages/404.jsx'
import { Contact } from './pages/Contact'
import { HomePage } from './pages/Home.jsx'
import { Route } from './components/Route.jsx'

function App() {
  
  return (
    <>
      <Header />
      <Route path="/" component={HomePage} />
      <Route path="/search" component={Search} />
      <Route path="/contact" component={Contact} />
      <Route path="/404" component={NotFoundPage} />
      <Footer />
    </>
  )
}

export default App