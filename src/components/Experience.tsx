"use client";

import React, { useState } from "react";

interface TimelineItem {
  role: string;
  company: string;
  duration: string;
  bullets: string[];
  tags: string[];
}

export default function Experience() {
  const [activeTab, setActiveTab] = useState<"work" | "education">("work");

  const workExperience: TimelineItem[] = [
    {
      role: "Full-Stack Developer Intern",
      company: "Envint Services LLP",
      duration: "Nov 2023 - Present",
      bullets: [
        "Developed scalable backend services and REST APIs using Node.js and Express.js, improving system performance by 20% and supporting high-concurrency workloads.",
        "Designed optimized NoSQL data models in DynamoDB, implementing indexing strategies that reduced data retrieval time by 15%.",
        "Built and maintained CI/CD pipelines on AWS using CodePipeline, CodeBuild, and CodeDeploy, automating deployments and reducing release cycles by 30%.",
        "Integrated AI capabilities using Large Language Models (LLMs) with Retrieval-Augmented Generation (RAG) and MongoDB Atlas Vector Search for investor monitoring.",
      ],
      tags: ["Node.js", "Express.js", "DynamoDB", "AWS Lambda", "CI/CD", "LLMs", "Vector Search"],
    },
    {
      role: "Software Engineer Intern",
      company: "Finquant Technologies Pvt Ltd",
      duration: "Aug 2023 - Sep 2023 (2 Months)",
      bullets: [
        "Developed interactive web pages using ASP.NET, C#, and JavaScript, improving UI responsiveness and user experience.",
        "Identified and resolved 100+ bugs in .NET applications, addressing logic, performance, and compatibility issues.",
        "Built a cross-platform jewelry marketplace mobile app using React Native and Node.js.",
      ],
      tags: ["ASP.NET", "C#", "React Native", "Node.js", "REST APIs"],
    },
    {
      role: "Full-Stack Web Developer Intern",
      company: "PIEDS BITS Pilani – DEDSO (Startup)",
      duration: "2023",
      bullets: [
        "Rebuilt backend services for an event management platform using Node.js and Express.js, developing scalable REST APIs to connect colleges and companies.",
        "Implemented dynamic multi-form workflows with JavaScript and MongoDB, enabling real-time validation.",
      ],
      tags: ["Node.js", "Express.js", "MongoDB", "REST APIs", "JavaScript"],
    },
    {
      role: "Backend Developer Intern",
      company: "PIEDS BITS Pilani – DreamSync (Startup)",
      duration: "2023",
      bullets: [
        "Built a secure media storage system using AWS S3, AWS Lambda, and REST APIs for scalable uploads.",
        "Generated 150+ pre-signed URLs per day to enable secure, time-limited media sharing.",
      ],
      tags: ["AWS S3", "AWS Lambda", "REST APIs", "Storage Optimization"],
    },
    {
      role: "Full-Stack Developer",
      company: "Freelance / Self-Employed",
      duration: "2022 - 2024",
      bullets: [
        "Delivered web applications and platforms for 10+ clients using Node.js, React, MongoDB, and Express.js.",
        "Developed solutions including a transport booking platform, referral system with JWT authentication, and custom business websites.",
      ],
      tags: ["React.js", "Node.js", "Express.js", "MongoDB", "JWT Auth"],
    },
  ];

  const education = [
    {
      title: "Bachelor of Science in Computer Science (Final Year)",
      institution: "Birla Institute of Technology & Science, Pilani",
      duration: "Batch 2023",
      details: "Focus on Core Computer Science theories, software engineering paradigms, and data structures.",
    },
    {
      title: "Advance Diploma in Computer Programming (ADCP)",
      institution: "Rajeev Gandhi Computer Saksharta Mission, Satnali",
      duration: "2021",
      details: "Comprehensive training in fundamental computer programming, database concepts, and system architecture.",
    },
  ];

  const triggerHighlight = (nodeName: string, active: boolean) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("node-highlight", { detail: { name: nodeName, active } })
      );
    }
  };

  return (
    <section id="experience">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h2 style={{ fontSize: "2rem", fontWeight: 700 }}>
            PROFESSIONAL_<span className="glow-text">JOURNEY</span>
          </h2>
        </div>

        {/* Tab Controls */}
        <div
          className="glass"
          style={{
            display: "inline-flex",
            padding: "3px",
            borderRadius: "6px",
            border: "1px solid var(--border-color)",
          }}
        >
          <button
            onClick={() => setActiveTab("work")}
            style={{
              padding: "8px 18px",
              borderRadius: "4px",
              border: "none",
              background: activeTab === "work" ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" : "transparent",
              color: activeTab === "work" ? "#030712" : "var(--color-text)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "var(--transition-smooth)",
              fontSize: "0.95rem",
            }}
          >
            Experience
          </button>
          <button
            onClick={() => setActiveTab("education")}
            style={{
              padding: "8px 18px",
              borderRadius: "4px",
              border: "none",
              background: activeTab === "education" ? "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)" : "transparent",
              color: activeTab === "education" ? "#030712" : "var(--color-text)",
              fontWeight: 600,
              cursor: "pointer",
              transition: "var(--transition-smooth)",
              fontSize: "0.95rem",
            }}
          >
            Education
          </button>
        </div>
      </div>

      {activeTab === "work" ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", position: "relative", paddingLeft: "1.25rem" }}>
          {/* Vertical Timeline Bar */}
          <div
            style={{
              position: "absolute",
              left: "0",
              top: "10px",
              bottom: "10px",
              width: "2px",
              background: "linear-gradient(to bottom, var(--color-primary), var(--color-secondary))",
              opacity: 0.3,
            }}
          />

          {workExperience.map((item, index) => {
            // Map companies to specific 3D mesh nodes
            const targetNode = item.company.includes("Envint")
              ? "Orchestrator_EKS"
              : item.company.includes("Finquant")
              ? "Compute_EC2_Backup"
              : "Database_RDS";

            return (
              <div key={index} style={{ position: "relative", paddingLeft: "2rem" }}>
                {/* Timeline Bullet */}
                <div
                  className="pulsing-node"
                  style={{
                    position: "absolute",
                    left: "-4px",
                    top: "20px",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: index === 0 ? "var(--color-primary)" : "var(--color-secondary)",
                    border: "2px solid var(--bg-color)",
                    zIndex: 2,
                  }}
                />

                {/* Work Card */}
                <div
                  className="glass-interactive"
                  onMouseEnter={() => triggerHighlight(targetNode, true)}
                  onMouseLeave={() => triggerHighlight(targetNode, false)}
                  style={{
                    borderRadius: "8px",
                    padding: "1.5rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff" }}>{item.role}</h3>
                      <h4 style={{ fontSize: "1.1rem", fontWeight: 500, color: "var(--color-primary)" }}>{item.company}</h4>
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontSize: "0.85rem",
                        color: "var(--color-muted)",
                        background: "rgba(255,255,255,0.03)",
                        padding: "3px 10px",
                        borderRadius: "4px",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      {item.duration}
                    </span>
                  </div>

                  <ul style={{ paddingLeft: "1.25rem", color: "var(--color-muted)", fontSize: "1.05rem", lineHeight: 1.6, marginBottom: "1.25rem" }}>
                    {item.bullets.map((b, idx) => (
                      <li key={idx} style={{ marginBottom: "0.45rem" }}>
                        {b}
                      </li>
                    ))}
                  </ul>

                  {/* Tags */}
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {item.tags.map((t, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.8rem",
                          color: "var(--color-secondary)",
                          border: "1px solid rgba(167, 139, 250, 0.15)",
                          background: "rgba(167, 139, 250, 0.03)",
                          padding: "3px 8px",
                          borderRadius: "3px",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem", width: "100%" }}>
          {education.map((item, index) => (
            <div
              key={index}
              className="glass-interactive"
              onMouseEnter={() => triggerHighlight("Database_RDS", true)}
              onMouseLeave={() => triggerHighlight("Database_RDS", false)}
              style={{
                borderRadius: "8px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.85rem",
                    color: "var(--color-primary)",
                    background: "rgba(0, 242, 254, 0.05)",
                    border: "1px solid rgba(0, 242, 254, 0.15)",
                    padding: "3px 8px",
                    borderRadius: "4px",
                    display: "inline-block",
                    marginBottom: "1rem",
                  }}
                >
                  {item.duration}
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>{item.title}</h3>
                <h4 style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--color-muted)", marginBottom: "1rem" }}>{item.institution}</h4>
                <p style={{ color: "var(--color-muted)", fontSize: "1.02rem", lineHeight: 1.5 }}>{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
