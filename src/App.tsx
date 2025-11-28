import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Room from './pages/admin/Room';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='admin' element={<AdminLayout />}>
          <Route path='room' element={<Room />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
