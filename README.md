🧠 SignalCare

Multi-Signal Health Monitoring for Non-Verbal Patients

📌 Overview

SignalCare is an AI-powered monitoring system designed to detect early signs of health deterioration in non-verbal individuals such as elderly patients, infants, or cognitively impaired individuals.

The system analyzes behavioral patterns from a live feed and combines them with caregiver inputs and historical baselines to generate meaningful insights and real-time alerts.

🚨 Problem

Non-verbal patients cannot communicate discomfort, pain, or distress effectively.

Caregivers often rely on:

delayed observation subjective judgment manual logging

This leads to missed early warning signs and delayed intervention.

💡 Solution

SignalCare continuously monitors behavioral signals and detects deviations from normal patterns.

It:

Tracks real-time activity using computer vision Compares behavior against personal and research baselines Identifies abnormal trends and safety risks Generates alerts and actionable recommendations

⚙️ Key Features

🎥 Real-Time Monitoring Processes video input using computer vision Tracks motion and behavioral signals Updates activity and engagement metrics in real time

📊 Multi-Signal Analysis Activity Restlessness Appetite & feeding engagement Interaction levels

📉 Baseline Comparison Compares current behavior to: Short-term (7-day) trends Long-term (30-day) patterns Research-based reference ranges

🚨 Intelligent Alerts Detects: Sudden drops in activity Increased restlessness Feeding deviations Safety risks (e.g., fall patterns) Provides: Severity classification Clear recommendations for caregivers

🧾 AI-Generated Reports Summarizes behavioral trends Highlights deviations from baseline Helps caregivers understand what the data means

🏗️ Tech Stack

Frontend:

React (Vite) Context API for state management Recharts for visualization

Backend:

FastAPI RESTful APIs

Computer Vision:

MediaPipe OpenCV 🔄 System Flow Video Feed → Computer Vision → Behavioral Signals
→ Baseline Comparison → Alert Engine → UI Dashboard

👤 User Flow Caregiver sets up patient profile and baseline System monitors behavior via video Signals are continuously updated Alerts are triggered when deviations occur Dashboard displays trends, alerts, and summaries

🎯 Impact

SignalCare enables:

Earlier detection of health issues Reduced caregiver burden Better decision-making through data Improved safety for vulnerable individuals

🚀 Future Work Real-time caregiver notifications (SMS / app alerts) Integration with wearable devices Personalized AI models per patient Long-term predictive health scoring

👩‍💻 Author

Shruthi Anbazhagan
