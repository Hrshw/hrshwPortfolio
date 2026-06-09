"use client";

import React from "react";
import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "Core Languages",
    skills: ["JavaScript", "TypeScript", "Python", "Java", "C++"]
  },
  {
    title: "Frontend Engineering",
    skills: ["React.js", "Next.js", "TailwindCSS", "Framer Motion", "Three.js"]
  },
  {
    title: "Backend & Systems",
    skills: ["Node.js", "Express", "MongoDB", "PostgreSQL", "Redis", "Kafka"]
  },
  {
    title: "Cloud & DevOps",
    skills: ["AWS EC2", "AWS S3", "Docker", "CI/CD", "Linux"]
  }
];

export default function SkillsSection() {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center px-8 md:px-24 py-24 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-wide">
            Technical Arsenal
          </h2>
          <div className="flex-1 h-[1px] bg-gradient-to-r from-[var(--color-secondary)] to-transparent ml-8 opacity-50" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {skillCategories.map((category, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-mono text-[var(--color-secondary)] mb-6">{category.title}</h3>
              <div className="flex flex-col gap-3">
                {category.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-3 group">
                    <div className="w-2 h-2 rounded-full bg-gray-700 group-hover:bg-[var(--color-primary)] transition-colors" />
                    <span className="text-gray-300 group-hover:text-white transition-colors text-lg">{skill}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
