# Sentinel AI

## Product Requirements Document (PRD)

Version: 1.0
Date: June 2026
Status: Active Development

---

# 1. Executive Summary

Sentinel AI is a multi-tenant AI-powered cybersecurity operations platform designed to help organizations detect, investigate, analyze, remediate, and report cyber threats through a unified SaaS experience.

The platform combines:

* Threat Detection
* Threat Intelligence
* Security Analytics
* AI Security Copilot
* Security Operations (SOC)
* Threat Investigation
* Automated Remediation
* Executive Reporting

Sentinel AI targets organizations that require enterprise-grade security monitoring without the complexity and cost of traditional SIEM and SOAR platforms.

---

# 2. Vision

To become the AI-native cybersecurity operations platform that enables security teams to detect, understand, and remediate threats faster than traditional SOC workflows.

---

# 3. Problem Statement

Security teams face several challenges:

* Excessive alert volume
* Lack of context around threats
* Manual investigation workflows
* Fragmented tooling
* Expensive SIEM platforms
* Limited security expertise in smaller organizations

Organizations need:

* Centralized threat visibility
* AI-assisted investigation
* Actionable threat intelligence
* Automated remediation workflows
* Executive-level reporting

---

# 4. Target Customers

## Primary

### Security Analysts

Monitor threats, investigate incidents, and manage remediation.

### SOC Teams

Require dashboards, analytics, and AI assistance.

### MSSPs

Manage multiple client environments from a single platform.

### Security Administrators

Track organizational security posture and compliance.

---

## Secondary

### Enterprises

Require centralized visibility and reporting.

### Managed Security Providers

Need multi-tenant operations and customer isolation.

---

# 5. Product Goals

## Goal 1

Reduce time-to-detect (TTD) security threats.

---

## Goal 2

Reduce time-to-investigate (TTI) incidents.

---

## Goal 3

Automate threat remediation workflows.

---

## Goal 4

Provide AI-driven security insights.

---

## Goal 5

Enable enterprise-grade multi-tenancy.

---

# 6. Success Metrics

## Platform KPIs

* Threat Detection Accuracy
* Threat Resolution Rate
* Mean Time to Detect (MTTD)
* Mean Time to Respond (MTTR)
* AI Recommendation Acceptance Rate

---

## Business KPIs

* Monthly Active Organizations
* Monthly Active Analysts
* Reports Generated
* Threats Resolved
* Customer Retention

---

# 7. User Roles

## Security Analyst

Permissions:

* View threats
* Investigate incidents
* Use AI terminal
* Generate reports

---

## Security Administrator

Permissions:

* Full dashboard access
* Manage assets
* Manage users
* Execute remediation workflows

---

## MSSP Operator

Permissions:

* Multi-customer visibility
* Tenant switching
* Reporting

---

# 8. Core Product Modules

## 8.1 Authentication & Identity

Purpose:

Secure user authentication and authorization.

Features:

* Clerk Authentication
* Login
* Signup
* Session Management
* JWT Verification
* Protected Routes
* User Isolation

Requirements:

* All API requests require authentication.
* All tenant data must be isolated.

---

## 8.2 Security Dashboard

Purpose:

Provide a real-time overview of organizational security posture.

Metrics:

* Total Threats
* Active Threats
* Resolved Threats
* Critical Threats
* Security Score
* Assets Monitored
* Country Distribution
* Threat Trends

Visualizations:

* Trend Charts
* Severity Distribution
* Geographic Threat Maps
* Activity Timeline

---

## 8.3 Threat Management

Purpose:

Central repository for threat lifecycle management.

Features:

* Create Threat
* Update Threat
* Delete Threat
* Filter Threats
* Search Threats
* Threat Details

Threat Attributes:

* ID
* Type
* Severity
* Status
* Source
* Country
* Asset
* Detection Time
* Resolution Time

Statuses:

* Active
* Investigating
* Blocked
* Resolved

---

## 8.4 Security Analytics

Purpose:

Provide historical and real-time threat intelligence.

Features:

### Threat Trends

Track incidents over time.

### Severity Distribution

Threat classification breakdown.

### Geographic Analytics

Country-level threat distribution.

### Threat Categories

* Phishing
* Malware
* DDoS
* Intrusion
* Credential Abuse

---

## 8.5 AI Security Copilot

Purpose:

Provide conversational access to platform intelligence.

Technology:

Google Gemini API

Capabilities:

* Threat analysis
* Dashboard explanations
* Security recommendations
* Investigation assistance
* Executive summaries

Commands:

* show threats
* show critical threats
* show active threats
* analyze threat
* show dashboard stats
* generate executive report
* generate SOC report
* run scan
* show trends

Future Features:

* Conversation memory
* Saved sessions
* Historical context
* Chat search

---

## 8.6 Threat Intelligence

Purpose:

Enrich threats with external intelligence.

Features:

* IOC enrichment
* Reputation lookup
* Threat categorization
* Risk scoring

Data Sources:

Future integrations:

* VirusTotal
* AbuseIPDB
* AlienVault OTX
* MISP

---

## 8.7 Threat Remediation Engine

Purpose:

Automate investigation-to-resolution workflows.

Workflow:

Threat Detection
↓
Threat Classification
↓
AI Analysis
↓
Remediation Plan
↓
Approval
↓
Execution
↓
Audit Logging

Capabilities:

* Threat grouping
* AI-generated remediation plans
* Risk reduction estimates
* Automated status updates
* Audit tracking

Supported Categories:

* Malware
* Phishing
* DDoS
* Intrusion

Outputs:

* Recommended actions
* Estimated risk reduction
* Resolution summary

---

## 8.8 Reporting System

Purpose:

Generate stakeholder-ready reports.

Report Types:

### Executive Report

Audience:

CISO
Executives
Management

Contains:

* Security posture
* Risk overview
* Trends
* Recommendations

---

### SOC Report

Audience:

Security Operations Teams

Contains:

* Incident details
* Threat metrics
* Analyst findings

---

### Threat Report

Detailed threat investigation report.

---

### Remediation Report

Actions taken and outcomes.

---

Formats:

* PDF
* Downloadable reports
* Scheduled reports

---

## 8.9 Audit Logging

Purpose:

Provide complete security activity tracking.

Events:

* User login
* Threat creation
* Threat updates
* Threat deletion
* Remediation execution
* Report generation

Audit Fields:

* User
* Action
* Timestamp
* Entity
* Outcome

---

# 9. Multi-Tenant Architecture

Requirement:

Strict tenant isolation.

Every query must be filtered by:

clerk_user_id

Example:

WHERE clerk_user_id = current_user

Applies To:

* Dashboard
* Threats
* Analytics
* Reports
* AI Terminal
* Remediation Engine
* Audit Logs

No tenant may access another tenant's data.

---

# 10. Security Requirements

## Authentication

* Clerk JWT validation
* Session verification
* Protected APIs

---

## Authorization

Role-based access control (RBAC)

Roles:

* Analyst
* Administrator
* MSSP Operator

---

## Secrets Management

Sensitive credentials must never be exposed to browsers.

Backend Only:

* GEMINI_API_KEY
* CLERK_SECRET_KEY
* SUPABASE_SERVICE_ROLE_KEY
* SMTP_PASSWORD
* STRIPE_SECRET_KEY

Frontend Allowed:

* NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
* NEXT_PUBLIC_API_URL
* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY

---

## AI Security

Clients must never call Gemini directly.

Required Architecture:

Browser
↓
Frontend
↓
Backend
↓
Gemini API

---

# 11. Non-Functional Requirements

Availability:

99.9%

---

Performance:

Dashboard load under 2 seconds.

---

Scalability:

Support:

* Thousands of organizations
* Millions of threat records

---

Compliance Ready:

* SOC2
* ISO 27001
* GDPR

---

# 12. Technical Architecture

Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Framer Motion
* Recharts

---

Backend

* Node.js
* Express.js
* TypeScript

---

Database

Supabase PostgreSQL

---

Authentication

Clerk

---

AI

Google Gemini

---

Deployment

Frontend:
Vercel

Backend:
Railway / Render / VPS

Database:
Supabase Cloud

---

# 13. Product Roadmap

## Phase 1

Dashboard Audit

* Verify all metrics
* Remove hardcoded data
* Connect real analytics

---

## Phase 2

Security Hardening

* Secrets migration
* Backend AI architecture
* Endpoint audit

---

## Phase 3

Threat Remediation Engine

* AI remediation plans
* Audit logs
* Execution workflow

---

## Phase 4

Advanced Reporting

* Executive reports
* SOC reports
* PDF export

---

## Phase 5

Threat Intelligence

* IOC enrichment
* Reputation scoring
* External feeds

---

## Phase 6

Enterprise Features

* RBAC
* MSSP management
* Tenant administration

---

# 14. Current Product Status

Authentication: 95%

Dashboard: 85%

Analytics: 95%

Threat Management: 95%

Delete Functionality: 100%

AI Terminal: 90%

Reports: 60%

Threat Remediation Engine: 15%

Overall Product Completion: ~85%
