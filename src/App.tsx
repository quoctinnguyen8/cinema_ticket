import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Room from './pages/admin/Room';
import ClientLayout from './layouts/ClientLayout';
import Register from './pages/client/Register';
import Login from './pages/client/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='admin' element={<AdminLayout />}>
          <Route path='room' element={<Room />} />
        </Route>

        <Route element={<ClientLayout />}>
          <Route path='dang-ky' element={<Register />} />
          <Route path='dang-nhap' element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
