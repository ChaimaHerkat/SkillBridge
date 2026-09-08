import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import Dashboard from "../pages/Dashboard/Dashboard";
import CreateProject from "../pages/Dashboard/CreateProject";
import Marketplace from "../pages/Marketplace/Marketplace";
import ProjectDetails from "../pages/Marketplace/ProjectDetails";
import Messages from "../pages/Messages";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

function AppRoutes() {
  return (
    <Routes>

      {/* =====================================================
          PUBLIC PAGES
      ===================================================== */}

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

      {/* =====================================================
          AUTH PAGES
      ===================================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      {/* =====================================================
          DASHBOARD
      ===================================================== */}

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />
      <Route
        path="/dashboard/create-project"
        element={<CreateProject />}
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

      {/* Messaging */}
      <Route
        path="/messages"
        element={
          <>
            <Header />
            <Messages />
            <Footer />
          </>
        }
      />

    </Routes>
  );
}

export default AppRoutes;