import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import OnboardingPage from "./pages/OnboardingPage";
import SubjectSetupPage from "./pages/SubjectSetupPage";

import MonitoringPage from "./pages/MonitoringPage";
import CaregiverInputPage from "./pages/CaregiverInputPage";
import TrendsPage from "./pages/TrendsPage";
import AlertsPage from "./pages/AlertsPage";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/onboarding" replace />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/setup" element={<SubjectSetupPage />} />
       
        <Route path="/monitoring" element={<MonitoringPage />} />
        <Route path="/caregiver-input" element={<CaregiverInputPage />} />
        <Route path="/trends" element={<TrendsPage />} />
        <Route path="/alerts" element={<AlertsPage />} />
      </Routes>
    </Layout>
  );
}