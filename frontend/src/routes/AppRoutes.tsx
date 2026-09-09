import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import CreateProject from "../pages/Dashboard/CreateProject";

import Marketplace from "../pages/Marketplace/Marketplace";
import ProjectDetails from "../pages/Marketplace/ProjectDetails";

import Messages from "../pages/Messages";

import Freelancers from "../pages/Freelancer/Freelancers";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* Home */}
      <Route
        path="/"
        element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        }
      />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard/create-project"
        element={
          <ProtectedRoute>
            <CreateProject />
          </ProtectedRoute>
        }
      />

      {/* Freelancers */}
      <Route
        path="/freelancers"
        element={
          <>
            <Header />
            <Freelancers />
            <Footer />
          </>
        }
      />

      {/* Marketplace */}
      <Route
        path="/marketplace"
        element={
          <>
            <Header />
            <Marketplace />
            <Footer />
          </>
        }
      />

      {/* Project Details */}
      <Route
        path="/marketplace/:id"
        element={
          <>
            <Header />
            <ProjectDetails />
            <Footer />
          </>
        }
      />

      {/* Messages */}
      <Route
        path="/messages"
        element={
          <ProtectedRoute>
            <>
              <Header />
              <Messages />
              <Footer />
            </>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;