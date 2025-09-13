import { BrowserRouter as Router , Routes , Route } from "react-router-dom";
import Home from "./views/Home/Home";
import Layout from "./views/Home/Layout";
import Hotels from "./views/Hotel/Hotels";
import Login from "./views/Auth/Login";
import Rooms from "./views/Hotel/Rooms";
import Reservation from "./views/Hotel/Reservation";
import Forget from "./views/Auth/Forget";
import Register from "./views/Auth/Register";
import Reset from "./views/Auth/Reset";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Clients from "./views/Hotel/Clients";
import Calender from "./views/Hotel/Calender";
import UserProfile from "./views/Hotel/UserProfil";
import EditProfile from "./views/Hotel/EditProfil";
import LogoutButton from "./views/Hotel/Logout";
import Reclamation from "./views/Hotel/Reclamation";
function App() {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Layout />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/hotels/:id/rooms" element={<Rooms />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/userprofil" element={<UserProfile />} />
          <Route path="/logout" element={<LogoutButton />} />
          <Route path="/EditProfil" element={<EditProfile />} />
          <Route path="/Reclamations" element={<Reclamation />} />







        </Route>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
          />
          
          
      
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <Forget />
            </PublicRoute>
          }
        />
        
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/auth/reset/:token"
          element={
            <PublicRoute>
              <Reset />
            </PublicRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
