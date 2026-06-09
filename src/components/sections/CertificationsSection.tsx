"use client";

import React from "react";
import { motion } from "framer-motion";

const certifications = [
  {
    title: "Full-Stack Web Developer",
    issuer: "Udemy",
    date: "June 2024",
    link: "#"
  },
  {
    title: "AWS S3 Basics",
    issuer: "Coursera Project Network",
    date: "September 2023",
    link: "#"
  },
  {
    title: "AWS CloudFront: Serve Content from Multiple S3 Buckets",
    issuer: "Coursera",
    date: "August 2023",
    link: "#"
  },
  {
    title: "Configuring Your IDE for Absolute Beginners with AWS Cloud9",
    issuer: "Coursera",
    date: "August 2023",
    link: "#"
  },
  {
    title: "Web Development",
    issuer: "Certificate of Training",
    date: "2023",
    link: "#"
  },
  {
    title: "Fundamentals of Digital Marketing",
    issuer: "Google Digital Garage",
    date: "2023",
    link: "#"
  }
];

export default function CertificationsSection() {
  return (
    <section id="section-certifications" className="min-h-[70vh] flex flex-col justify-center px-8 md:px-24 py-32 relative" style={{ zIndex: 10 }}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white tracking-tighter mb-4 transition-colors duration-500">
            Certifications.
          </h2>
          <p className="text-zinc-600 dark:text-zinc-500 text-lg md:text-xl font-light tracking-tight transition-colors duration-500">
            Continuous learning and official recognition of technical proficiencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-black/5 dark:bg-zinc-900/30 backdrop-blur-xl border border-black/5 dark:border-white/5 rounded-2xl p-8 relative group hover:border-black/20 dark:hover:border-white/10 transition-colors duration-500"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] opacity-0 group-hover:opacity-100 transition-opacity rounded-t-2xl" />
              <div className="text-zinc-500 text-xs font-mono uppercase tracking-widest mb-3">{cert.date}</div>
              <h3 className="text-xl font-medium text-zinc-900 dark:text-zinc-200 mb-2 leading-snug transition-colors duration-500">{cert.title}</h3>
              <p className="text-zinc-600 dark:text-zinc-500 text-sm transition-colors duration-500">{cert.issuer}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
