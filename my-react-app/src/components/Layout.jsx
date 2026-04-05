import React from "react";
import { NavLink } from "react-router-dom";
import {
  Activity,
  Bell,
  ChartColumnBig,
  ClipboardPenLine,
  House,
  Settings2,
  Sparkles,
  Video,
} from "lucide-react";

export default function Layout({ children }) {
  const navItems = [
    { to: "/onboarding", label: "Onboarding", icon: <Sparkles size={18} /> },
    { to: "/setup", label: "Subject Setup", icon: <Settings2 size={18} /> },
    
    { to: "/monitoring", label: "Monitoring", icon: <Video size={18} /> },
    {
      to: "/caregiver-input",
      label: "Caregiver Input",
      icon: <ClipboardPenLine size={18} />,
    },
    { to: "/trends", label: "Trends", icon: <ChartColumnBig size={18} /> },
    { to: "/alerts", label: "Alerts", icon: <Bell size={18} /> },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Activity size={18} />
          </div>
          <div>
            <h1>SignalCare</h1>
            <p>Multi-signal monitoring for non-verbal subjects</p>
          </div>
        </div>

        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="main-content">{children}</main>
    </div>
  );
}