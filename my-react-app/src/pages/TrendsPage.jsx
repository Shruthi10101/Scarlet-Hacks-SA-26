import React, { useMemo, useState } from "react";
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

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function buildSeries(currentValue, feed7Base, avg7Base, avg30Base, researchBase) {
  const feed7 = [...feed7Base, currentValue];
  const avg7Series = [...avg7Base];
  avg7Series[avg7Series.length - 1] = Math.round(
    feed7.reduce((sum, value) => sum + value, 0) / feed7.length
  );

  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Today"];

  return labels.map((label, index) => ({
    label,
    current: feed7[index],
    avg7: avg7Series[index],
    avg30: avg30Base[index],
    research: researchBase[index],
  }));
}

function MetricTrendCard({ title, subtitle, chartData }) {
  const todayPoint = chartData[chartData.length - 1];
  const deviation7 = todayPoint.current - todayPoint.avg7;
  const deviation30 = todayPoint.current - todayPoint.avg30;
  const deviationResearch = todayPoint.current - todayPoint.research;

  return (
    <SectionCard title={title} subtitle={subtitle}>
      <div className="trend-chart-wrap">
        <ResponsiveContainer width="100%" height={420}>
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 20, left: 8, bottom: 16 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend verticalAlign="top" height={40} />
            <Line
              type="monotone"
              dataKey="current"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              name="Current / Today"
            />
            <Line
              type="monotone"
              dataKey="avg7"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Past 7 Days"
            />
            <Line
              type="monotone"
              dataKey="avg30"
              stroke="#64748b"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Past 30 Days"
            />
            <Line
              type="monotone"
              dataKey="research"
              stroke="#16a34a"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Research Standard"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="trend-summary-grid">
        <div className="trend-summary-card">
          <span>Today</span>
          <strong>{todayPoint.current}%</strong>
        </div>
        <div className="trend-summary-card">
          <span>Deviation vs 7-day</span>
          <strong className={deviation7 < 0 ? "negative" : "positive"}>
            {deviation7 > 0 ? "+" : ""}
            {deviation7}%
          </strong>
        </div>
        <div className="trend-summary-card">
          <span>Deviation vs 30-day</span>
          <strong className={deviation30 < 0 ? "negative" : "positive"}>
            {deviation30 > 0 ? "+" : ""}
            {deviation30}%
          </strong>
        </div>
        <div className="trend-summary-card">
          <span>Deviation vs research</span>
          <strong className={deviationResearch < 0 ? "negative" : "positive"}>
            {deviationResearch > 0 ? "+" : ""}
            {deviationResearch}%
          </strong>
        </div>
      </div>
    </SectionCard>
  );
}

function getDeviationLabel(metricName, current, avg7, avg30, research) {
  const d7 = current - avg7;
  const d30 = current - avg30;
  const dr = current - research;

  if (metricName === "Restlessness") {
    if (d7 > 10 || d30 > 12 || dr > 12) return "high-concern";
    if (d7 > 4 || d30 > 5 || dr > 5) return "watch";
    return "stable";
  }

  if (d7 < -12 || d30 < -15 || dr < -15) return "high-concern";
  if (d7 < -5 || d30 < -7 || dr < -7) return "watch";
  return "stable";
}

function buildMetricInsight(metricName, current, avg7, avg30, research, timelineLabel) {
  const status = getDeviationLabel(metricName, current, avg7, avg30, research);

  let summary = "";
  let recommendation = "";

  if (metricName === "Activity") {
    if (status === "high-concern") {
      summary = `${timelineLabel} analysis shows activity is meaningfully below expected baseline and research reference levels.`;
      recommendation =
        "Check for fatigue, pain, mobility limitations, environmental stress, or unusual inactivity. Increase observation and confirm whether reduced movement persists.";
    } else if (status === "watch") {
      summary = `${timelineLabel} analysis shows activity is slightly below expected levels and should be monitored for continued decline.`;
      recommendation =
        "Continue monitoring, encourage normal movement if appropriate, and compare against the next reporting window before escalating.";
    } else {
      summary = `${timelineLabel} analysis shows activity remains broadly aligned with historical and reference expectations.`;
      recommendation =
        "Continue routine monitoring and use this period to strengthen the subject baseline.";
    }
  }

  if (metricName === "Restlessness") {
    if (status === "high-concern") {
      summary = `${timelineLabel} analysis shows restlessness is elevated above short-term, long-term, and reference expectations.`;
      recommendation =
        "Review sleep environment, discomfort cues, noise, temperature, and other possible causes of agitation.";
    } else if (status === "watch") {
      summary = `${timelineLabel} analysis shows restlessness is moderately elevated and should be watched for persistence.`;
      recommendation =
        "Continue observation and check whether the increase is linked to time of day, environment, or a disrupted routine.";
    } else {
      summary = `${timelineLabel} analysis shows restlessness is within expected range.`;
      recommendation =
        "Maintain current care conditions and continue tracking for change over time.";
    }
  }

  if (metricName === "Appetite") {
    if (status === "high-concern") {
      summary = `${timelineLabel} analysis shows appetite-related signals are substantially below short-term, long-term, and research expectations.`;
      recommendation =
        "Review meal engagement, feeding conditions, interest in food, and whether intake should be logged more closely.";
    } else if (status === "watch") {
      summary = `${timelineLabel} analysis shows appetite is mildly reduced compared with baseline.`;
      recommendation =
        "Monitor the next feeding window, note meal completion, and watch for continued reduction.";
    } else {
      summary = `${timelineLabel} analysis shows appetite appears stable relative to expected behavior.`;
      recommendation =
        "Continue routine feeding observation and maintain baseline logs.";
    }
  }

  if (metricName === "Interaction") {
    if (status === "high-concern") {
      summary = `${timelineLabel} analysis shows interaction is significantly below baseline, suggesting reduced engagement or responsiveness.`;
      recommendation =
        "Increase check-ins, observe response to caregiver presence, and note whether reduced engagement continues across later sessions.";
    } else if (status === "watch") {
      summary = `${timelineLabel} analysis shows interaction is somewhat below expected levels and should be monitored for further decline.`;
      recommendation =
        "Continue logging responsiveness and compare against the next reporting window before escalation.";
    } else {
      summary = `${timelineLabel} analysis shows interaction is within the expected range.`;
      recommendation =
        "Maintain routine monitoring and use this period to strengthen the subject baseline.";
    }
  }

  return { status, summary, recommendation, metricName };
}

function buildReport({ timelineLabel, metrics }) {
  const sections = metrics.map((metric) =>
    buildMetricInsight(
      metric.name,
      metric.current,
      metric.avg7,
      metric.avg30,
      metric.research,
      timelineLabel
    )
  );

  const highConcernCount = sections.filter(
    (section) => section.status === "high-concern"
  ).length;
  const watchCount = sections.filter(
    (section) => section.status === "watch"
  ).length;

  let overview = "";
  if (highConcernCount >= 2) {
    overview = `${timelineLabel} AI summary: multiple behavioral signals are showing concerning deviation from recent and longer-term expectations.`;
  } else if (highConcernCount === 1 || watchCount >= 2) {
    overview = `${timelineLabel} AI summary: one or more signals show moderate deviation and should be monitored more closely.`;
  } else {
    overview = `${timelineLabel} AI summary: behavior remains broadly aligned with historical and reference expectations, with no major deviation pattern detected.`;
  }

  return { overview, sections };
}

export default function TrendsPage() {
  const { liveMetrics } = useAppContext();
  const [selectedTimeline, setSelectedTimeline] = useState("Daily");
  const [showFullReport, setShowFullReport] = useState(false);

  const currentActivity = clamp(liveMetrics.activity || 0, 0, 100);
  const currentRestlessness = clamp(liveMetrics.restlessness || 0, 0, 100);
  const currentAppetite = clamp(liveMetrics.appetite || 0, 0, 100);
  const currentInteraction = clamp(liveMetrics.interaction || 0, 0, 100);

  const activityData = useMemo(
    () =>
      buildSeries(
        currentActivity,
        [72, 69, 74, 66, 63, 58],
        [74, 74, 73, 72, 71, 70, 70],
        [78, 78, 77, 77, 76, 76, 75],
        [70, 70, 70, 70, 70, 70, 70]
      ),
    [currentActivity]
  );

  const restlessnessData = useMemo(
    () =>
      buildSeries(
        currentRestlessness,
        [34, 36, 38, 42, 45, 49],
        [35, 35, 36, 37, 38, 39, 40],
        [30, 30, 31, 31, 32, 32, 33],
        [28, 28, 28, 28, 28, 28, 28]
      ),
    [currentRestlessness]
  );

  const appetiteData = useMemo(
    () =>
      buildSeries(
        currentAppetite,
        [76, 74, 73, 71, 69, 66],
        [75, 75, 74, 73, 72, 71, 70],
        [80, 80, 79, 79, 78, 78, 77],
        [78, 78, 78, 78, 78, 78, 78]
      ),
    [currentAppetite]
  );

  const interactionData = useMemo(
    () =>
      buildSeries(
        currentInteraction,
        [72, 70, 68, 66, 63, 61],
        [73, 72, 71, 70, 69, 68, 67],
        [77, 77, 76, 76, 75, 75, 74],
        [74, 74, 74, 74, 74, 74, 74]
      ),
    [currentInteraction]
  );

  const reportMetrics = useMemo(() => {
    const activityToday = activityData[activityData.length - 1];
    const restlessnessToday = restlessnessData[restlessnessData.length - 1];
    const appetiteToday = appetiteData[appetiteData.length - 1];
    const interactionToday = interactionData[interactionData.length - 1];

    return [
      {
        name: "Activity",
        current: activityToday.current,
        avg7: activityToday.avg7,
        avg30: activityToday.avg30,
        research: activityToday.research,
      },
      {
        name: "Restlessness",
        current: restlessnessToday.current,
        avg7: restlessnessToday.avg7,
        avg30: restlessnessToday.avg30,
        research: restlessnessToday.research,
      },
      {
        name: "Appetite",
        current: appetiteToday.current,
        avg7: appetiteToday.avg7,
        avg30: appetiteToday.avg30,
        research: appetiteToday.research,
      },
      {
        name: "Interaction",
        current: interactionToday.current,
        avg7: interactionToday.avg7,
        avg30: interactionToday.avg30,
        research: interactionToday.research,
      },
    ];
  }, [activityData, restlessnessData, appetiteData, interactionData]);

  const report = useMemo(() => {
    return buildReport({
      timelineLabel: selectedTimeline,
      metrics: reportMetrics,
    });
  }, [selectedTimeline, reportMetrics]);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Behavior Trends</p>
          <h1>Deviation Analysis</h1>
          <p className="page-subtitle">
            Current behavioral signals are compared against short-term,
            long-term, and research baselines to highlight deviation patterns.
          </p>
        </div>
      </div>

      <SectionCard
        title="AI Deviation Report"
        subtitle="Plain-language interpretation of the graphs with timeline-based recommendations"
      >
        <div className="mode-switcher" style={{ marginBottom: "18px" }}>
          <button
            className={selectedTimeline === "Daily" ? "mode-btn active" : "mode-btn"}
            onClick={() => setSelectedTimeline("Daily")}
          >
            Daily
          </button>
          <button
            className={selectedTimeline === "Monthly" ? "mode-btn active" : "mode-btn"}
            onClick={() => setSelectedTimeline("Monthly")}
          >
            Monthly
          </button>
          <button
            className={selectedTimeline === "Yearly" ? "mode-btn active" : "mode-btn"}
            onClick={() => setSelectedTimeline("Yearly")}
          >
            Yearly
          </button>
        </div>

        <div className="trend-summary-card" style={{ marginBottom: "18px" }}>
          <span>Overview</span>
          <p className="body-copy">{report.overview}</p>
        </div>

        <div className="session-controls" style={{ marginBottom: "18px" }}>
          <button className="primary-btn" onClick={() => setShowFullReport((prev) => !prev)}>
            {showFullReport ? "Hide detailed interpretation" : "View detailed interpretation"}
          </button>
        </div>

        {showFullReport && (
          <div className="stack">
            {report.sections.map((section, index) => (
              <div key={index} className="trend-summary-card">
                <span>{section.metricName}</span>
                <p className="body-copy" style={{ marginBottom: "12px" }}>
                  {section.summary}
                </p>
                <p className="body-copy">
                  <strong>Recommendation:</strong> {section.recommendation}
                </p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      <div className="stack">
        <MetricTrendCard
          title="Activity Deviation Overview"
          subtitle="Current activity against short-term, long-term, and research baselines"
          chartData={activityData}
        />

        <MetricTrendCard
          title="Restlessness Deviation Overview"
          subtitle="Current restlessness compared with 7-day, 30-day, and research reference patterns"
          chartData={restlessnessData}
        />

        <MetricTrendCard
          title="Appetite Deviation Overview"
          subtitle="Current appetite signal compared with baseline feed history and research standards"
          chartData={appetiteData}
        />

        <MetricTrendCard
          title="Interaction Deviation Overview"
          subtitle="Current interaction signal compared against short-term, long-term, and standard references"
          chartData={interactionData}
        />
      </div>
    </div>
  );
}