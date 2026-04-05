import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SectionCard from "../components/SectionCard";

export default function SubjectSetupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    age: "",
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.name || !form.age) {
      alert("Please fill out required fields.");
      return;
    }

    // Dummy setup (no backend dependency)
    localStorage.setItem("subject_profile", JSON.stringify(form));

    navigate("/trends"); // go somewhere safe
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Setup</p>
          <h1>Set up monitoring</h1>
          <p className="page-subtitle">
            Enter basic information to initialize tracking and baseline comparison.
          </p>
        </div>
      </div>

      <SectionCard title="Subject Information">
        <form onSubmit={handleSubmit} className="mock-form">
          <label>
            Name
            <input
              type="text"
              name="name"
              placeholder="Enter name"
              value={form.name}
              onChange={handleChange}
            />
          </label>

          <label>
            Age
            <input
              type="number"
              name="age"
              placeholder="Enter age"
              value={form.age}
              onChange={handleChange}
            />
          </label>

          <label>
            Notes (optional)
            <textarea
              name="notes"
              rows="3"
              placeholder="Any relevant observations"
              value={form.notes}
              onChange={handleChange}
            />
          </label>

          <button className="primary-btn" type="submit">
            Continue
          </button>
        </form>
      </SectionCard>
    </div>
  );
}