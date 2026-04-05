import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import SectionCard from "../components/SectionCard";
import { useAppContext } from "../context/AppContext";

const STORAGE_KEY = "signalcare_caregiver_uploaded_logs";
const DAY_ORDER = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function normalizeDay(day) {
  const map = {
    mon: "Mon", monday: "Mon",
    tue: "Tue", tuesday: "Tue",
    wed: "Wed", wednesday: "Wed",
    thu: "Thu", thursday: "Thu",
    fri: "Fri", friday: "Fri",
    sat: "Sat", saturday: "Sat",
    sun: "Sun", sunday: "Sun",
  };
  return map[String(day).toLowerCase()] || "";
}

function clampScore(value) {
  const num = Number(value);
  if (Number.isNaN(num)) return "";
  return Math.max(1, Math.min(10, num));
}

function parseCsv(text) {
  const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
  const headers = lines[0].toLowerCase();

  if (!headers.includes("day") || !headers.includes("appetite") || !headers.includes("interaction")) {
    throw new Error("CSV must have: day, appetite, interaction");
  }

  const parsed = [];

  for (let i = 1; i < lines.length; i++) {
    const [day, appetite, interaction] = lines[i].split(",");

    const d = normalizeDay(day);
    const a = clampScore(appetite);
    const inter = clampScore(interaction);

    if (d && a && inter) {
      parsed.push({ day: d, appetite: a, interaction: inter });
    }
  }

  return parsed;
}

function avg(arr) {
  if (!arr.length) return null;
  return (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1);
}

export default function CaregiverInputPage() {
  const { caregiverLogs } = useAppContext();

  const [uploadedLogs, setUploadedLogs] = useState([]);
  const [manual, setManual] = useState({ day: "Mon", appetite: "", interaction: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setUploadedLogs(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(uploadedLogs));
  }, [uploadedLogs]);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    file.text().then(text => {
      try {
        const parsed = parseCsv(text);
        setUploadedLogs(parsed);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    });
  }

  function handleManualSubmit(e) {
    e.preventDefault();

    const day = normalizeDay(manual.day);
    const appetite = clampScore(manual.appetite);
    const interaction = clampScore(manual.interaction);

    if (!day || !appetite || !interaction) {
      setError("Enter valid values (1–10)");
      return;
    }

    setUploadedLogs(prev => [
      ...prev.filter(r => r.day !== day),
      { day, appetite, interaction }
    ]);

    setManual({ day: "Mon", appetite: "", interaction: "" });
    setError("");
  }

  const chartData = useMemo(() => {
    return DAY_ORDER.map(day => {
      const base = caregiverLogs.find(l => l.day === day);
      const up = uploadedLogs.find(l => l.day === day);

      return {
        day,
        baseAppetite: base?.appetite ? base.appetite / 10 : null,
        upAppetite: up?.appetite || null,
        baseInteraction: base?.interaction ? base.interaction / 10 : null,
        upInteraction: up?.interaction || null,
      };
    });
  }, [caregiverLogs, uploadedLogs]);

  const summary = useMemo(() => {
    return {
      baseA: avg(caregiverLogs.map(l => l.appetite / 10)),
      upA: avg(uploadedLogs.map(l => l.appetite)),
      baseI: avg(caregiverLogs.map(l => l.interaction / 10)),
      upI: avg(uploadedLogs.map(l => l.interaction)),
    };
  }, [caregiverLogs, uploadedLogs]);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Caregiver Data Comparison</h1>
      </div>

      <div className="setup-grid">
        <SectionCard title="Upload CSV">
          <input type="file" accept=".csv" onChange={handleUpload} />
          {error && <p className="form-error">{error}</p>}
        </SectionCard>

        <SectionCard title="Manual Entry (1–10 scale)">
          <form onSubmit={handleManualSubmit} className="mock-form">
            <select name="day" value={manual.day} onChange={e => setManual({...manual, day: e.target.value})}>
              {DAY_ORDER.map(d => <option key={d}>{d}</option>)}
            </select>

            <input
              type="number"
              placeholder="Appetite (1–10)"
              value={manual.appetite}
              onChange={e => setManual({...manual, appetite: e.target.value})}
            />

            <input
              type="number"
              placeholder="Interaction (1–10)"
              value={manual.interaction}
              onChange={e => setManual({...manual, interaction: e.target.value})}
            />

            <button className="primary-btn">Save</button>
          </form>
        </SectionCard>
      </div>

      <SectionCard title="Comparison Graph">
        <div style={{ height: 400 }}>
          <ResponsiveContainer>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis domain={[1, 10]} />
              <Tooltip />
              <Legend />

              <Line dataKey="baseAppetite" stroke="#16a34a" name="Baseline Appetite" />
              <Line dataKey="upAppetite" stroke="#2563eb" name="Uploaded Appetite" />

              <Line dataKey="baseInteraction" stroke="#7c3aed" name="Baseline Interaction" />
              <Line dataKey="upInteraction" stroke="#ea580c" name="Uploaded Interaction" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      <SectionCard title="Summary">
        <p>Baseline Appetite Avg: {summary.baseA}</p>
        <p>Uploaded Appetite Avg: {summary.upA}</p>
        <p>Baseline Interaction Avg: {summary.baseI}</p>
        <p>Uploaded Interaction Avg: {summary.upI}</p>
      </SectionCard>
    </div>
  );
}