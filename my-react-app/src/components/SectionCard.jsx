import React from "react";

export default function SectionCard({ title, subtitle, children, rightContent }) {
  return (
    <section className="section-card">
      <div className="section-header">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {rightContent}
      </div>
      {children}
    </section>
  );
}