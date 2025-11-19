import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Capture from './pages/Capture'
import Gallery from './pages/Gallery'
import Groups from './pages/Groups'
import GroupView from './pages/GroupView'
import JoinGroup from './pages/JoinGroup'
import Header from './components/Header'

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/capture" element={<Capture />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/groups" element={<Groups />} />
          <Route path="/groups/:id" element={<GroupView />} />
          <Route path="/join/:id" element={<JoinGroup />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
