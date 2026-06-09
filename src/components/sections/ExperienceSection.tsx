"use client";

import React from "react";
import { motion } from "framer-motion";

const experiences = [
  {
    role: "Full-Stack Developer",
    company: "Envint Services LLP",
    period: "Nov 2023 - Present",
    description: "Developed scalable backend services and REST APIs using Node.js and Express.js, improving system performance by 20%. Built CI/CD pipelines and managed AWS infrastructure (EC2, S3, Lambda). Integrated LLMs with RAG and MongoDB Atlas Vector Search."
  },
  {
    role: "Software Engineer Intern",
    company: "Finquant Technologies Pvt Ltd",
    period: "Aug 2023 - Sep 2023",
    description: "Developed interactive web pages using ASP.NET, C#, and JavaScript. Resolved 100+ bugs to improve system stability. Built a cross-platform jewelry marketplace mobile app using React Native."
  },
  {
    role: "Full-Stack Web Developer Intern",
    company: "PIEDS BITS Pilani – DEDSO",
    period: "2023",
    description: "Rebuilt backend services for an event management platform. Implemented dynamic multi-form submission workflows with JavaScript and MongoDB."
  },
  {
    role: "Backend Developer Intern",
    company: "PIEDS BITS Pilani – DreamSync",
    period: "2023",
    description: "Built a secure media storage system using AWS S3, AWS Lambda, and REST APIs. Generated 150+ pre-signed URLs per day for secure sharing."
  },
  {
    role: "Full-Stack Developer",
    company: "Freelance",
    period: "2022 - 2024",
    description: "Delivered web applications for 10+ clients using Node.js, React, and MongoDB, including transport booking platforms and referral systems with JWT."
  }
];

export default function ExperienceSection() {
  return (
    <section className="min-h-screen flex flex-col justify-center px-8 md:px-24 py-32 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-24">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
            Experience.
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-light tracking-tight max-w-2xl">
            A timeline of my professional journey in software engineering and cloud architecture.
          </p>
        </div>

        <div className="relative border-l border-zinc-800 ml-4 md:ml-8 space-y-20">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative pl-10 md:pl-16 group"
            >
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-zinc-300 transition-colors duration-500 ring-4 ring-[#010204]" />
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4 mb-3">
                <h3 className="text-2xl md:text-3xl font-semibold text-zinc-200 tracking-tight">{exp.role}</h3>
                <span className="text-zinc-600 hidden md:inline">/</span>
                <span className="text-zinc-400 font-medium">{exp.company}</span>
              </div>
              
              <div className="font-mono text-xs text-zinc-500 mb-6 tracking-widest uppercase">
                {exp.period}
              </div>
              
              <p className="text-zinc-400 text-lg leading-relaxed max-w-3xl font-light">
                {exp.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
