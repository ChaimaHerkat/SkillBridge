import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home/Home";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

import Dashboard from "../pages/Dashboard/Dashboard";
import CreateProject from "../pages/Dashboard/CreateProject";
import ClientProjects from "../pages/Dashboard/ClientProjects";
import MyProjects from "../pages/Dashboard/MyProjects";

import Marketplace from "../pages/Marketplace/Marketplace";
import ProjectDetails from "../pages/Marketplace/ProjectDetails";

import Messages from "../pages/Messages/Messages";

import Freelancers from "../pages/Freelancer/Freelancers";

import CreateProposal from "../pages/CreateProposal/CreateProposal";

import ProjectProposals from "../pages/Dashboard/ProjectProposals";

import Proposals from "../pages/Dashboard/Proposals";

import MyProfile from "../pages/Dashboard/MyProfile";

import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";

import ProtectedRoute from "../components/ProtectedRoute";

function AppRoutes() {
  return (
    <Routes>
      {/* ==================== HOME ==================== */}
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

      {/* ==================== AUTHENTICATION ==================== */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ==================== DASHBOARD ==================== */}

      {/* Main Dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Create Project */}
      <Route
        path="/dashboard/create-project"
        element={
          <ProtectedRoute>
            <>
              <Header />
              <CreateProject />
              <Footer />
            </>
          </ProtectedRoute>
        }
      />

      {/* Client - My Projects */}
      <Route
        path="/dashboard/projects"
        element={
          <ProtectedRoute>
            <>
              <Header />
              <ClientProjects />
              <Footer />
            </>
          </ProtectedRoute>
        }
      />

     <Route
       path="/dashboard/my-projects"
       element={
        <ProtectedRoute>
          <>
            <Header />
            <MyProjects />
            <Footer />
          </>
        </ProtectedRoute>
       }
      />


      <Route
        path="/dashboard/projects/:id/proposals"
        element={
          <ProtectedRoute>
            <>
              <Header />
              <ProjectProposals />
              <Footer />
            </>
          </ProtectedRoute>
        }
      />

      {/* ==================== PROPOSALS ==================== */}

      {/* Create Proposal */}
      <Route
        path="/marketplace/:id/proposal"
        element={
          <ProtectedRoute>
            <>
              <Header />
              <CreateProposal />
              <Footer />
            </>
          </ProtectedRoute>
        }
      />

      <Route
         path="/dashboard/proposals"
          element={<Proposals />}
      />

      <Route
         path="/dashboard/profile"
         element={
           <ProtectedRoute>
             <>
               <Header />
               <MyProfile />
               <Footer />
               </>
           </ProtectedRoute>
          }
      />


      {/* ==================== FREELANCERS ==================== */}

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

      {/* ==================== MARKETPLACE ==================== */}

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

    
      {/* ==================== MESSAGES ==================== */}

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

