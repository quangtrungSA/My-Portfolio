"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Code2 } from "lucide-react";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

// Tech logos with official brand colors
const techLogos: Record<string, React.ReactNode> = {
  // C# - Multiple variations (DB: "C# / .NET")
  "c#": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/><path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1l1.2-6.2h4.9l-1.2 6.2h3.8l1.2-6.2h4.8l-1.2 6.2h2.1v4.7h-3l-.9 4.3h4v4.7h-4.9l-1.2 6.2h-4.9l1.2-6.2h-3.8l-1.2 6.2h-4.8l1.2-6.2h-2.1v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"/></svg>,
  "c# / .net": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#9B4F96" d="M115.4 30.7L67.1 2.9c-.8-.5-1.9-.7-3.1-.7-1.2 0-2.3.3-3.1.7l-48 27.9c-1.7 1-2.9 3.5-2.9 5.4v55.7c0 1.1.2 2.4 1 3.5l106.8-62c-.6-1.2-1.5-2.1-2.4-2.7z"/><path fill="#68217A" d="M10.7 95.3c.5.8 1.2 1.5 1.9 1.9l48.2 27.9c.8.5 1.9.7 3.1.7 1.2 0 2.3-.3 3.1-.7l48-27.9c1.7-1 2.9-3.5 2.9-5.4V36.1c0-.9-.1-1.9-.6-2.8l-106.6 62z"/><path fill="#fff" d="M85.3 76.1C81.1 83.5 73.1 88.5 64 88.5c-13.5 0-24.5-11-24.5-24.5s11-24.5 24.5-24.5c9.1 0 17.1 5 21.3 12.5l13-7.5c-6.8-11.9-19.6-20-34.3-20-21.8 0-39.5 17.7-39.5 39.5s17.7 39.5 39.5 39.5c14.6 0 27.4-8 34.2-19.8l-12.9-7.6zM97 66.2l.9-4.3h-4.2v-4.7h5.1l1.2-6.2h4.9l-1.2 6.2h3.8l1.2-6.2h4.8l-1.2 6.2h2.1v4.7h-3l-.9 4.3h4v4.7h-4.9l-1.2 6.2h-4.9l1.2-6.2h-3.8l-1.2 6.2h-4.8l1.2-6.2h-2.1v-4.7H97zm4.8 0h3.8l.9-4.3h-3.8l-.9 4.3z"/></svg>,
  // Salesforce - DB: "Salesforce (Apex)", "Salesforce DB"
  "salesforce": <svg viewBox="0 0 48 32" className="w-5 h-5"><circle fill="#00A1E0" cx="10" cy="21" r="9"/><circle fill="#00A1E0" cx="18" cy="14" r="10"/><circle fill="#00A1E0" cx="30" cy="12" r="11"/><circle fill="#00A1E0" cx="38" cy="19" r="8.5"/><circle fill="#00A1E0" cx="24" cy="21" r="9"/></svg>,
  "salesforce (apex)": <svg viewBox="0 0 48 32" className="w-5 h-5"><circle fill="#00A1E0" cx="10" cy="21" r="9"/><circle fill="#00A1E0" cx="18" cy="14" r="10"/><circle fill="#00A1E0" cx="30" cy="12" r="11"/><circle fill="#00A1E0" cx="38" cy="19" r="8.5"/><circle fill="#00A1E0" cx="24" cy="21" r="9"/></svg>,
  "salesforce db": <svg viewBox="0 0 48 32" className="w-5 h-5"><circle fill="#00A1E0" cx="10" cy="21" r="9"/><circle fill="#00A1E0" cx="18" cy="14" r="10"/><circle fill="#00A1E0" cx="30" cy="12" r="11"/><circle fill="#00A1E0" cx="38" cy="19" r="8.5"/><circle fill="#00A1E0" cx="24" cy="21" r="9"/></svg>,
  // Java
  "java": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#5382A1" d="M52 8c-2 4-4 8-3 13 1 6 6 10 10 14 5 5 10 10 10 18 0 6-3 11-7 15l-4 4c4-1 8-4 11-7 6-7 8-17 3-25-4-7-10-12-15-17-3-4-6-8-5-15z"/><path fill="#5382A1" d="M68 32c-1 3-3 6-2 9 1 5 5 8 9 11 4 4 8 9 8 16 0 5-2 9-5 13 3-1 6-3 8-6 5-6 6-14 2-21-3-6-8-10-12-14-3-3-5-6-8-8z"/><path fill="#E76F00" d="M28 72h72c0 0 0 20-4 30-3 8-10 14-20 17-6 2-12 3-18 3s-12-1-18-3c-10-3-17-9-20-17-4-10-4-30-4-30z"/><path fill="#F8981D" d="M36 78c1 8 3 15 6 20 4 6 10 10 18 12 4 1 8 2 12 2s8-1 12-2c8-2 14-6 18-12 3-5 5-12 6-20H36z"/></svg>,
  // Spring - Leaf logo (DB: "Spring Boot", "Spring MVC")
  "spring boot": <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#6DB33F" d="M21.8 2.2c-.6 1.2-1.6 2.2-2.8 2.9C18.6 2.7 16.4.9 13.8.2c0 0-.2 2.7-2.7 6.2S4.6 13.8 4.6 13.8s3.5-1.5 6.5-5.3c2-2.5 3-4.5 3.5-5.8.6.8 1 1.8 1.1 2.8.1 2.5-1.2 4.8-3.3 6.2-2.7 1.8-5.9 2.3-9 1.5C1.7 17 1.1 20.5 3.2 22.6c2 2 5.2 2.2 7.4 1.8 7.1-1.2 12.7-7.3 13.2-14.5.3-3.1-.5-5.9-2-7.7z"/></svg>,
  "spring mvc": <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#6DB33F" d="M21.8 2.2c-.6 1.2-1.6 2.2-2.8 2.9C18.6 2.7 16.4.9 13.8.2c0 0-.2 2.7-2.7 6.2S4.6 13.8 4.6 13.8s3.5-1.5 6.5-5.3c2-2.5 3-4.5 3.5-5.8.6.8 1 1.8 1.1 2.8.1 2.5-1.2 4.8-3.3 6.2-2.7 1.8-5.9 2.3-9 1.5C1.7 17 1.1 20.5 3.2 22.6c2 2 5.2 2.2 7.4 1.8 7.1-1.2 12.7-7.3 13.2-14.5.3-3.1-.5-5.9-2-7.7z"/></svg>,
  "spring": <svg viewBox="0 0 24 24" className="w-5 h-5"><path fill="#6DB33F" d="M21.8 2.2c-.6 1.2-1.6 2.2-2.8 2.9C18.6 2.7 16.4.9 13.8.2c0 0-.2 2.7-2.7 6.2S4.6 13.8 4.6 13.8s3.5-1.5 6.5-5.3c2-2.5 3-4.5 3.5-5.8.6.8 1 1.8 1.1 2.8.1 2.5-1.2 4.8-3.3 6.2-2.7 1.8-5.9 2.3-9 1.5C1.7 17 1.1 20.5 3.2 22.6c2 2 5.2 2.2 7.4 1.8 7.1-1.2 12.7-7.3 13.2-14.5.3-3.1-.5-5.9-2-7.7z"/></svg>,
  // RESTful API
  "restful api": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#009688" d="M64 8C33.1 8 8 33.1 8 64s25.1 56 56 56 56-25.1 56-56S94.9 8 64 8zm0 100c-24.3 0-44-19.7-44-44s19.7-44 44-44 44 19.7 44 44-19.7 44-44 44z"/><path fill="#009688" d="M84 52H44c-2.2 0-4 1.8-4 4v16c0 2.2 1.8 4 4 4h40c2.2 0 4-1.8 4-4V56c0-2.2-1.8-4-4-4z"/></svg>,
  // HTML / CSS (DB: "HTML / CSS")
  "html / css": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/></svg>,
  "html": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/></svg>,
  "html5": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/></svg>,
  "css": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543z"/><path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16z"/></svg>,
  "css3": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543z"/><path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16z"/></svg>,
  // JavaScript
  "javascript": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"/><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581z"/><path fill="#323330" d="M57.903 104.7c1.459 2.226 3.295 3.873 6.758 3.873 2.85 0 4.66-1.42 4.66-3.48 0-2.41-1.872-3.27-5.01-4.67l-1.717-.74c-4.963-2.11-8.26-4.76-8.26-10.36 0-5.16 3.93-9.08 10.08-9.08 4.37 0 7.51 1.52 9.77 5.51l-5.35 3.44c-1.18-2.11-2.45-2.94-4.42-2.94-2.01 0-3.29 1.28-3.29 2.94 0 2.06 1.28 2.89 4.24 4.16l1.72.74c5.85 2.5 9.15 5.07 9.15 10.82 0 6.2-4.87 9.59-11.41 9.59-6.39 0-10.52-3.05-12.53-7.04l5.58-3.21zM38.17 105.37c1.07 1.9 2.05 3.51 4.4 3.51 2.24 0 3.66-.88 3.66-4.29V80.25h7.18v24.5c0 7.07-4.14 10.29-10.19 10.29-5.46 0-8.63-2.83-10.24-6.24l5.19-3.43z"/></svg>,
  // ReactJS
  "reactjs": <svg viewBox="-13.5 -12 27 24" className="w-5 h-5"><circle cx="0" cy="0" r="2.35" fill="#61DAFB"/><g fill="none" stroke="#61DAFB" strokeWidth="1.6"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>,
  "react": <svg viewBox="-13.5 -12 27 24" className="w-5 h-5"><circle cx="0" cy="0" r="2.35" fill="#61DAFB"/><g fill="none" stroke="#61DAFB" strokeWidth="1.6"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>,
  // Oracle Database — racetrack "O" logo
  "oracle database": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fillRule="evenodd" clipRule="evenodd" fill="#F80000" d="M42.6 28C22.3 28 5.8 44.5 5.8 64.8s16.5 36.8 36.8 36.8h42.8c20.3 0 36.8-16.5 36.8-36.8S107.9 28 87.6 28H42.6zm42.8 60.9H42.6c-13.3 0-24.1-10.8-24.1-24.1s10.8-24.1 24.1-24.1h42.8c13.3 0 24.1 10.8 24.1 24.1s-10.8 24.1-24.1 24.1z"/></svg>,
  "oracle": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fillRule="evenodd" clipRule="evenodd" fill="#F80000" d="M42.6 28C22.3 28 5.8 44.5 5.8 64.8s16.5 36.8 36.8 36.8h42.8c20.3 0 36.8-16.5 36.8-36.8S107.9 28 87.6 28H42.6zm42.8 60.9H42.6c-13.3 0-24.1-10.8-24.1-24.1s10.8-24.1 24.1-24.1h42.8c13.3 0 24.1 10.8 24.1 24.1s-10.8 24.1-24.1 24.1z"/></svg>,
  // MySQL
  "mysql": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#4479A1" d="M116.3 109.6c-3.2-2.5-6.6-4.6-10.3-6.1-2-.8-4.2-1.5-6.3-2.1-1.5-.4-3.5-.7-4.6-1.8-1.8-2.4-3.3-5.2-4.7-7.9-2.3-4.5-4.4-9.3-6.2-14.1-1-2.7-1.8-5.3-3.1-7.8C72.6 53.6 61.4 41 46.6 33c-4.1-2.2-8.7-3.9-13.3-5.1-2.5-.6-5-.8-7.5-1.2h-3c-.7-.2-1.4-.7-2-1.1-2.5-1.5-5.2-3.2-8-4.3-4.3-1.7-8.9-2.8-13.5-3-.6 0-1.8.3-2 .5-.7.4-.4 1.6-.2 2.4.5 1.9 1.1 3.7 1.9 5.5 1.8 4.1 3.8 8 6.1 11.8 1.2 2 2.4 4 3.8 5.8.8 1 1.8 1.9 2.5 3 .3.7.3 1.5.4 2.3.8 3.3 1.5 6.7 2.6 10 2 5.9 4.5 11.6 7.6 17 1.6 2.8 3.4 5.4 5.5 7.8l.8.8v-.1c-.4-.8-.9-1.5-1.3-2.3-1.5-3.1-2.7-6.3-3.3-9.7-.4-1.6-.5-3.3-.6-5 0-1 .2-2 .7-2.8.5-.8 1.4-1.4 2.3-1.3 1 .1 1.7.8 2.3 1.6 1.5 2.5 2 5.4 2.5 8.2.6 3.1 1.1 6.2 2.2 9.2 1 2.7 2.4 5.2 4.2 7.4 2.2 2.7 4.8 5 7.7 6.8l2.7 1.4c-.1 0-.2.1-.3.1-3-.2-5.9-.8-8.6-2-1.5-.6-2.8-1.4-4.2-2.3l-.7-.3c1.5 2 3.2 3.8 5.1 5.4 3.3 2.7 7 4.8 11 6.2 4.5 1.5 9.2 2.1 13.9 2 4.7-.1 9.3-1 13.7-2.6 1.3-.5 2.6-1 3.8-1.6.7-.4 1.8-.5 2.3-1.1.8-1.3 1.5-2.8 2.2-4.2l4.2-8.8c1.6-3.5 3.1-7.2 5.4-10.3.7-.9 1.5-1.8 2.4-2.5 1-.7 2-.4 2.8.3 1 .9 1.6 2.2 2.1 3.4 1.5 3.8 1.7 8 2.1 12 .1.9.2 1.8.4 2.7l.2.1c.5-.9.9-1.9 1.2-2.9.9-3.3 1-6.8.6-10.2"/><path fill="#F29111" d="M57.3 7.5c-1.3 0-2.6.2-3.8.6l.1.2c.6 1.1 1.6 1.9 2.4 2.9.7 1.1 1.3 2.2 2 3.3l.1-.1c1.3-.9 1.9-2.3 1.9-3.9 0-.8-.3-1.5-.7-2.1-.5-.6-1.2-.8-2-.9z"/></svg>,
  // SQL Server
  "sql server": <svg viewBox="0 0 128 128" className="w-5 h-5"><ellipse fill="#CC2927" cx="64" cy="26" rx="50" ry="18"/><path fill="#CC2927" d="M14 26v76c0 9.9 22.4 18 50 18s50-8.1 50-18V26c0 9.9-22.4 18-50 18S14 35.9 14 26z"/><ellipse fill="#E8583A" cx="64" cy="26" rx="42" ry="13"/><path fill="#fff" opacity="0.3" d="M14 52c0 9.9 22.4 18 50 18s50-8.1 50-18"/><path fill="#fff" opacity="0.3" d="M14 78c0 9.9 22.4 18 50 18s50-8.1 50-18"/></svg>,
  "sqlserver": <svg viewBox="0 0 128 128" className="w-5 h-5"><ellipse fill="#CC2927" cx="64" cy="26" rx="50" ry="18"/><path fill="#CC2927" d="M14 26v76c0 9.9 22.4 18 50 18s50-8.1 50-18V26c0 9.9-22.4 18-50 18S14 35.9 14 26z"/><ellipse fill="#E8583A" cx="64" cy="26" rx="42" ry="13"/><path fill="#fff" opacity="0.3" d="M14 52c0 9.9 22.4 18 50 18s50-8.1 50-18"/><path fill="#fff" opacity="0.3" d="M14 78c0 9.9 22.4 18 50 18s50-8.1 50-18"/></svg>,
  // Docker
  "docker": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#019BC6" d="M124.8 52.1c-4.3-2.5-10-2.8-14.8-1.4-.6-5.2-4-9.7-8-12.9l-1.6-1.3-1.4 1.6c-2.7 3.1-3.5 8.3-3.1 12.3.3 2.9 1.2 5.9 3 8.3-1.4.8-2.9 1.9-4.3 2.4-2.8 1-5.9 2-8.9 2H79V49H66V24H41v12H28V24H15v37H3.5l-.3 1.5c-.8 5.8-.2 11.7 2.1 17.1l.8 1.7.1.1c7.6 12.2 21.1 17.8 36.1 17.8 24.4 0 44.8-10.3 54.3-32.3 6.2.4 12.6-1.2 15.9-6.9z"/></svg>,
  // Git / GitHub (DB: "Git / GitHub")
  "git / github": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#F34F29" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/></svg>,
  "git": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#F34F29" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/></svg>,
  // Selenium WebDriver (DB: "Selenium WebDriver") - official Se logo
  "selenium webdriver": <svg viewBox="0 0 128 128" className="w-5 h-5"><rect width="128" height="128" rx="12" fill="#43B02A"/><text x="64" y="82" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="58" fill="#fff">Se</text></svg>,
  "selenium": <svg viewBox="0 0 128 128" className="w-5 h-5"><rect width="128" height="128" rx="12" fill="#43B02A"/><text x="64" y="82" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="58" fill="#fff">Se</text></svg>,
  // Linux (DB: "Linux (Ubuntu/CentOS)") - Tux penguin from devicon CDN
  // eslint-disable-next-line @next/next/no-img-element
  "linux (ubuntu/centos)": <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" alt="Linux" className="w-5 h-5" />,
  // eslint-disable-next-line @next/next/no-img-element
  "linux": <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/linux/linux-original.svg" alt="Linux" className="w-5 h-5" />,
  // Azure DevOps
  // eslint-disable-next-line @next/next/no-img-element
  "azure devops": <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuredevops/azuredevops-original.svg" alt="Azure DevOps" className="w-5 h-5" />,
  // eslint-disable-next-line @next/next/no-img-element
  "azuredevops": <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/azuredevops/azuredevops-original.svg" alt="Azure DevOps" className="w-5 h-5" />,
  // Bitbucket
  // eslint-disable-next-line @next/next/no-img-element
  "bitbucket": <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/bitbucket/bitbucket-original.svg" alt="Bitbucket" className="w-5 h-5" />,
  // Claude AI - Anthropic sparkle logo
  "claude": <svg viewBox="0 0 64 64" className="w-5 h-5"><path d="M37.54 8.8L27.03 55.2h-7.59L29.95 8.8h7.59zm-9.04 23.2l16.38-23.2h8.58L34.15 36.93l-5.65-4.93zM33.3 35.47L44.14 55.2h-8.73l-7.75-14.6 5.64-5.13z" fill="#D4A27F"/></svg>,
  // GitHub Copilot
  "github copilot": <svg viewBox="0 0 128 128" className="w-5 h-5"><rect width="128" height="128" rx="28" fill="#000"/><path d="M64 30c-18.8 0-34 12.1-34 27v14c0 14.9 15.2 27 34 27s34-12.1 34-27V57c0-14.9-15.2-27-34-27zm-14 40a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm28 0a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" fill="#fff"/></svg>,
  "copilot": <svg viewBox="0 0 128 128" className="w-5 h-5"><rect width="128" height="128" rx="28" fill="#000"/><path d="M64 30c-18.8 0-34 12.1-34 27v14c0 14.9 15.2 27 34 27s34-12.1 34-27V57c0-14.9-15.2-27-34-27zm-14 40a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm28 0a6 6 0 1 1 0-12 6 6 0 0 1 0 12z" fill="#fff"/></svg>,
  // Jenkins - official butler logo from devicon CDN
  // eslint-disable-next-line @next/next/no-img-element
  "jenkins": <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/jenkins/jenkins-original.svg" alt="Jenkins" className="w-5 h-5" />,
  // Maven / Gradle (DB: "Maven / Gradle", icon: "build")
  "maven / gradle": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#E8E0C5" d="M64 4L4 34v60l60 30 60-30V34L64 4z"/><path fill="#BE2025" d="M64 4L4 34l60 30 60-30L64 4z"/><path fill="#794229" d="M64 64v60l60-30V34L64 64z"/><path fill="#96291B" d="M4 34v60l60 30V64L4 34z"/><text x="64" y="78" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="26" fill="#fff">M</text></svg>,
  "maven": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#E8E0C5" d="M64 4L4 34v60l60 30 60-30V34L64 4z"/><path fill="#BE2025" d="M64 4L4 34l60 30 60-30L64 4z"/><path fill="#794229" d="M64 64v60l60-30V34L64 64z"/><path fill="#96291B" d="M4 34v60l60 30V64L4 34z"/><text x="64" y="78" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="26" fill="#fff">M</text></svg>,
  "build": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#E8E0C5" d="M64 4L4 34v60l60 30 60-30V34L64 4z"/><path fill="#BE2025" d="M64 4L4 34l60 30 60-30L64 4z"/><path fill="#794229" d="M64 64v60l60-30V34L64 64z"/><path fill="#96291B" d="M4 34v60l60 30V64L4 34z"/><text x="64" y="78" textAnchor="middle" fontFamily="Arial,sans-serif" fontWeight="bold" fontSize="26" fill="#fff">M</text></svg>,
  "gradle": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#02303A" d="M64 4C30.9 4 4 30.9 4 64s26.9 60 60 60 60-26.9 60-60S97.1 4 64 4z"/><circle fill="#fff" cx="64" cy="64" r="20"/></svg>,
  // Networking
  "networking": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#607D8B" d="M64 8C33.1 8 8 33.1 8 64s25.1 56 56 56 56-25.1 56-56S94.9 8 64 8zm0 100c-24.3 0-44-19.7-44-44s19.7-44 44-44 44 19.7 44 44-19.7 44-44 44z"/><circle fill="#607D8B" cx="64" cy="40" r="8"/><circle fill="#607D8B" cx="40" cy="80" r="8"/><circle fill="#607D8B" cx="88" cy="80" r="8"/></svg>,
  "node": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#83CD29" d="M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623c-.712 0-2.306 1.061-2.306 1.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073z"/></svg>,
  // Next.js variations  
  "nextjs": <svg viewBox="0 0 128 128" className="w-5 h-5"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"/></svg>,
  "next": <svg viewBox="0 0 128 128" className="w-5 h-5"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"/></svg>,
  // Tailwind variations
  "tailwindcss": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#38bdf8" d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64z"/></svg>,
  "tailwind": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#38bdf8" d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64z"/></svg>,
  // VS Code variation
  "vscode": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#007ACC" d="M95.68 24.15L65.34 0 28.66 28.1 0 74.37l28.66 25.6 66.68-27.82v27.57l28.66-21.6V24.15z"/></svg>,
  "visual studio code": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#007ACC" d="M95.68 24.15L65.34 0 28.66 28.1 0 74.37l28.66 25.6 66.68-27.82v27.57l28.66-21.6V24.15z"/></svg>,
  // IntelliJ variation
  "intellij": <svg viewBox="0 0 128 128" className="w-5 h-5"><rect fill="#000" width="128" height="128" rx="8"/><path fill="#fff" d="M24.6 98.7h36.8v6.2H24.6z"/></svg>,
  // Python
  "python": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#FFD43B" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z"/><path fill="#3776AB" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z"/></svg>,
  // Go/Golang
  "go": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#00ACD7" d="M99.617 47.432c-.289 0-.575.012-.86.036l-.001-.001a12.263 12.263 0 00-10.787-6.463c-1.598 0-3.151.312-4.608.908A15.025 15.025 0 0069.09 34.78c-3.129 0-6.013.983-8.396 2.638a14.92 14.92 0 00-11.758-5.721c-7.166 0-13.27 5.016-14.775 11.739a12.254 12.254 0 00-5.144-1.124c-6.797 0-12.302 5.524-12.302 12.313 0 6.787 5.505 12.311 12.302 12.311h70.6c5.886 0 10.664-4.785 10.664-10.676 0-5.893-4.778-10.828-10.664-10.828z"/></svg>,
  "golang": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#00ACD7" d="M99.617 47.432c-.289 0-.575.012-.86.036l-.001-.001a12.263 12.263 0 00-10.787-6.463c-1.598 0-3.151.312-4.608.908A15.025 15.025 0 0069.09 34.78c-3.129 0-6.013.983-8.396 2.638a14.92 14.92 0 00-11.758-5.721c-7.166 0-13.27 5.016-14.775 11.739a12.254 12.254 0 00-5.144-1.124c-6.797 0-12.302 5.524-12.302 12.313 0 6.787 5.505 12.311 12.302 12.311h70.6c5.886 0 10.664-4.785 10.664-10.676 0-5.893-4.778-10.828-10.664-10.828z"/></svg>,
  // PHP
  "php": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#6181B6" d="M64 33.039C30.26 33.039 2.906 46.901 2.906 64S30.26 94.961 64 94.961 125.094 81.099 125.094 64 97.74 33.039 64 33.039z"/><path fill="#fff" d="M35.285 58.065H44.2l-.777 4.024h-8.915l.777-4.024zM65.917 58.065H74.832l-.777 4.024H65.14l.777-4.024z"/></svg>,
  // Ruby
  "ruby": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#CC342D" d="M26.922 122.61L5.29 99.479l41.063-24.756-19.431 47.887zM114.919 103.379L121.613 20.96l-34.357 33.815 27.663 48.604zM52.929 6.39l15.935 33.25 30.563-29.72-46.498-3.53zM5.782 99.03l11.222-72.872 10.604 47.463L5.782 99.03zM21.243 23.538l6.285 51.907 37.435-8.037-43.72-43.87z"/></svg>,
  // Rust
  "rust": <svg viewBox="0 0 128 128" className="w-5 h-5"><path d="M62.271 9.833l-3.238 5.855-6.68-.934.334 6.702-6.037 3.042 4.334 5.217-3.565 5.67 6.556 1.57-.322 6.704 6.017-3.078 4.652 4.98 4.652-4.98 6.016 3.078-.32-6.704 6.555-1.57-3.565-5.67 4.334-5.217-6.037-3.042.334-6.702-6.68.934-3.238-5.855-5.036 4.305z"/></svg>,
  // Scala
  "scala": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#DC322F" d="M22.457 99.414V73.637c0-5.44 25.382-10.881 50.763-10.881v25.775c0 5.438-25.381 10.883-50.763 10.883zm50.763-62.66c-25.381 0-50.763 5.44-50.763 10.879V73.41c0-5.44 25.382-10.879 50.763-10.879s50.762-5.44 50.762-10.88c0-5.441-25.38-10.88-50.762-10.88v-.017z"/></svg>,
  // Kotlin
  "kotlin": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#7F52FF" d="M0 0h61.3L0 60.2zm0 128L64 64l64 64zm67.8-64L128 0H64.6z"/></svg>,
  // Swift
  "swift": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#F05138" d="M126.33 93.09c.32-1.74.5-3.7.52-5.85.07-10.47-4.16-18.3-10.04-24.33-3.78-3.88-10.06-5.4-10.06-5.4S111.2 73.57 97.09 89.96c0 0-8.27-8.42-16.77-20.77 9.1-8.3 28.91-30.73 25.14-45.04-2.43-9.22-7.55-15.5-15.92-21.83-3.84-2.9-11.16-2.62-11.16-2.62s2.83 6.33 2.22 16.88c-.61 10.55-3.97 19.17-9.52 27.68-2.9 4.44-8.73 11.9-15.25 19.54a144.14 144.14 0 01-26.49-39.45c14.12 19.55 23.54 29.8 42.12 43.29-8.41 9.32-17.3 17.87-21.38 20.68-14.26 9.84-33.43 7.35-33.43 7.35l-.3.1c10.68 11.31 25.51 15.92 40.54 15.5 10.47-.3 20.35-4.1 28.7-11.35 4.82-4.2 8.27-8.65 11.3-12.82 5.27 3.42 11.32 5.6 17.78 6.3 10.42 1.12 20.43-1.94 27.46-9.92 3.6-4.1 5.17-8.07 5.92-12.48z"/></svg>,
  nodejs: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#83CD29" d="M112.771 30.334L68.674 4.729c-2.781-1.584-6.402-1.584-9.205 0L14.901 30.334C12.031 31.985 10 35.088 10 38.407v51.142c0 3.319 2.084 6.423 4.954 8.083l11.775 6.688c5.628 2.772 7.617 2.772 10.178 2.772 8.333 0 13.093-5.039 13.093-13.828v-50.49c0-.713-.371-1.774-1.071-1.774h-5.623c-.712 0-2.306 1.061-2.306 1.773v50.49c0 3.896-3.524 7.773-10.11 4.48L18.723 90.73c-.424-.23-.723-.693-.723-1.181V38.407c0-.482.555-.966.982-1.213l44.424-25.561c.415-.235 1.025-.235 1.439 0l43.882 25.555c.42.253.272.722.272 1.219v51.142c0 .488.183.963-.232 1.198l-44.086 25.576c-.378.227-.847.227-1.261 0l-11.307-6.749c-.341-.198-.746-.269-1.073-.086-3.146 1.783-3.726 2.02-6.677 3.043-.726.253-1.797.692.41 1.929l14.798 8.754a9.294 9.294 0 004.647 1.246c1.642 0 3.25-.426 4.667-1.246l43.885-25.582c2.87-1.672 4.23-4.764 4.23-8.083V38.407c0-3.319-1.36-6.414-4.229-8.073z"/></svg>,
  typescript: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#007acc" d="M2 63.91v62.5h125v-125H2zm100.73-5a15.56 15.56 0 017.82 4.5 20.58 20.58 0 013 4c0 .16-5.4 3.81-8.69 5.85-.12.08-.6-.44-1.13-1.23a7.09 7.09 0 00-5.87-3.53c-3.79-.26-6.23 1.73-6.21 5a4.58 4.58 0 00.54 2.34c.83 1.73 2.38 2.76 7.24 4.86 8.95 3.85 12.78 6.39 15.16 10 2.66 4 3.25 10.46 1.45 15.24-2 5.2-6.9 8.73-13.83 9.9a38.32 38.32 0 01-9.52-.1 23 23 0 01-9.15-4.06c-1.15-1.27-3.39-4.58-3.25-4.82a9.34 9.34 0 011.15-.73l4.6-2.64 3.59-2.08.75 1.11a16.78 16.78 0 004.74 4.54c4 2.1 9.46 1.81 12.16-.62a5.43 5.43 0 00.69-6.92c-1-1.39-3-2.56-8.59-5-6.45-2.78-9.23-4.5-11.77-7.24a16.48 16.48 0 01-3.43-6.25 25 25 0 01-.22-8c1.33-6.23 6-10.58 12.82-11.87a31.66 31.66 0 019.49.26zm-29.34 5.24v5.12H57.16v46.23H45.65V69.26H29.38v-5a49.19 49.19 0 01.14-5.16c.06-.08 10-.12 22-.1h21.81z"/></svg>,
  "next.js": <svg viewBox="0 0 128 128" className="w-5 h-5"><path d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64c11.2 0 21.7-2.9 30.8-7.9L48.4 55.3v36.6h-6.8V41.8h6.8l50.5 75.8C116.4 106.2 128 86.5 128 64c0-35.3-28.7-64-64-64zm22.1 84.6l-7.5-11.3V41.8h7.5v42.8z"/></svg>,
  "tailwind css": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#38bdf8" d="M64.004 25.602c-17.067 0-27.73 8.53-32 25.597 6.398-8.531 13.867-11.73 22.398-9.597 4.871 1.214 8.352 4.746 12.207 8.66C72.883 56.629 80.145 64 96.004 64c17.066 0 27.73-8.531 32-25.602-6.399 8.536-13.867 11.735-22.399 9.602-4.87-1.215-8.347-4.746-12.207-8.66C55.128 71.371 47.868 64 32.004 64z"/></svg>,
  postgresql: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#336791" d="M93.809 92.112c.785-6.533.55-7.492 5.416-6.433l1.235.108c3.742.17 8.637-.602 11.513-1.938 6.191-2.873 9.861-7.668 3.758-6.409-13.924 2.873-14.881-1.842-14.881-1.842 14.703-21.815 20.849-49.508 15.543-56.287-14.47-18.489-39.517-9.746-39.936-9.52l-.134.025c-2.751-.571-5.83-.912-9.289-.968-6.301-.104-11.082 1.652-14.535 4.41 0 0-44.19-18.2-42.153 22.917.432 8.77 12.404 66.373 26.673 48.988 5.214-6.354 10.246-11.72 10.246-11.72a25.396 25.396 0 0011.503 2.756l.072-.06c-.082.834-.139 1.661-.146 2.617-.224 2.917-.031 3.858-.407 6.054-.524 3.063-2.24 10.16.615 12.799 6.315 5.828 19.635 3.818 21.508-6.7z"/></svg>,
  redis: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#A41E11" d="M121.8 93.1c-6.7 3.5-41.4 17.7-48.8 21.6-7.4 3.9-11.5 3.8-17.3 1S13 98.1 6.3 94.9c-3.3-1.6-5-2.9-5-4.2V78.5s48-10.5 55.8-13.2c7.8-2.8 10.4-2.9 17-.5s46.1 9.5 52.6 11.9v12.5c0 1.3-1.5 2.7-4.9 3.9z"/><path fill="#D82C20" d="M121.8 80.5C115.1 84 80.4 98.2 73 102.1c-7.4 3.9-11.5 3.8-17.3 1-5.8-2.8-42.7-17.7-49.4-20.9C-.3 79-.5 76.8 6 74.3c6.5-2.6 43.2-17 51-19.7 7.8-2.8 10.4-2.9 17-.5s41.1 16.1 47.6 18.5c6.7 2.4 6.9 4.4.2 7.9z"/></svg>,
  mongodb: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#439934" d="M90.491 57.282c-.37-4.79-1.35-9.28-2.95-13.47-2.93-7.67-7.39-14.39-13.19-19.97-3.27-3.14-6.86-5.91-10.77-8.29-1.45-.89-2.95-1.71-4.49-2.46.38-.89.53-1.89.4-2.9-.18-1.33-.76-2.52-1.61-3.44"/></svg>,
  kubernetes: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#326ce5" d="M64 1.6c-1.7 0-3.4.4-4.8 1.2L13.5 28.3c-3 1.7-5.2 4.9-5.5 8.3v53.7c.3 3.5 2.5 6.6 5.5 8.3l45.7 25.5c3 1.7 6.6 1.7 9.6 0l45.7-25.5c3-1.7 5.2-4.8 5.5-8.3V36.6c-.3-3.5-2.5-6.6-5.5-8.3L68.8 2.8c-1.4-.8-3.1-1.2-4.8-1.2z"/></svg>,
  aws: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#F7A80D" d="M38.089 77.466l-11.4 4.896 10.559 4.514 12.241-4.514z"/></svg>,
  nginx: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#009639" d="M64 0C28.7 0 0 28.7 0 64s28.7 64 64 64 64-28.7 64-64S99.3 0 64 0z"/><path fill="#fff" d="M45.2 45.4v44.2h10.6V56.3l16.4 33.3h10.5V45.4H72.2v33.1L55.8 45.4z"/></svg>,
  "intellij idea": <svg viewBox="0 0 128 128" className="w-5 h-5"><rect fill="#000" width="128" height="128" rx="8"/><path fill="#fff" d="M24.6 98.7h36.8v6.2H24.6z"/></svg>,
  "vs code": <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#007ACC" d="M95.68 24.15L65.34 0 28.66 28.1 0 74.37l28.66 25.6 66.68-27.82v27.57l28.66-21.6V24.15z"/></svg>,
  postman: <svg viewBox="0 0 128 128" className="w-5 h-5"><circle fill="#FF6C37" cx="64" cy="64" r="64"/></svg>,
  jira: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#2684FF" d="M109.9 61.5L67.5 19 63.7 23l-3.8-3.9L17.5 61.5c-2 2-2 5.2 0 7.2l42.4 42.4 3.8-3.9 3.8 3.9 42.4-42.4c2-2 2-5.2 0-7.2z"/></svg>,
  hibernate: <svg viewBox="0 0 128 128" className="w-5 h-5"><path fill="#59666C" d="M22 10l22 38H22L0 10h22zm0 108l22-38H22L0 118h22zm84-108L84 48h22l22-38h-22zm0 108l-22-38h22l22 38h-22zM64 10l22 38H42L64 10zm0 108l22-38H42l22 38z"/></svg>,
};

function getSkillLogo(skillName: string): React.ReactNode | null {
  // Normalize the skill name: lowercase, trim, replace multiple spaces
  const name = skillName.toLowerCase().trim().replace(/\s+/g, ' ');
  
  // Debug log - remove after testing
  // console.log("Skill name:", skillName, "-> normalized:", name);
  
  // Direct match
  if (techLogos[name]) return techLogos[name];
  
  // Try without spaces
  const noSpaces = name.replace(/\s/g, '');
  if (techLogos[noSpaces]) return techLogos[noSpaces];
  
  // Try with spaces replaced by hyphens
  const withHyphens = name.replace(/\s/g, '-');
  if (techLogos[withHyphens]) return techLogos[withHyphens];
  
  // Try partial match - check if the name contains any key or vice versa
  const keys = Object.keys(techLogos);
  for (const key of keys) {
    // Check if skill name contains the key
    if (name.includes(key)) {
      return techLogos[key];
    }
    // Check if key contains the skill name (for longer keys like "spring boot")
    if (key.includes(name) && name.length > 2) {
      return techLogos[key];
    }
  }
  
  // Try matching first word
  const firstWord = name.split(' ')[0];
  if (firstWord && techLogos[firstWord]) {
    return techLogos[firstWord];
  }
  
  return null;
}

// Define category order - Backend first
const categoryOrder = ["Backend", "Frontend", "Database", "Infrastructure", "Tools / VCS / AI", "Tools", "Other"];

const categoryColors: Record<string, { bg: string; text: string; pill: string; iconBg: string }> = {
  Backend:        { bg: "bg-blue-500",    text: "text-blue-700 dark:text-blue-300",    pill: "bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30 border-blue-200 dark:border-blue-800/50", iconBg: "bg-blue-500/10 dark:bg-blue-400/10" },
  Frontend:       { bg: "bg-purple-500",  text: "text-purple-700 dark:text-purple-300", pill: "bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30 border-purple-200 dark:border-purple-800/50", iconBg: "bg-purple-500/10 dark:bg-purple-400/10" },
  Database:       { bg: "bg-amber-500",   text: "text-amber-700 dark:text-amber-300",  pill: "bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/50 dark:to-amber-900/30 border-amber-200 dark:border-amber-800/50", iconBg: "bg-amber-500/10 dark:bg-amber-400/10" },
  Infrastructure: { bg: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300", pill: "bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30 border-emerald-200 dark:border-emerald-800/50", iconBg: "bg-emerald-500/10 dark:bg-emerald-400/10" },
  "Tools / VCS / AI": { bg: "bg-rose-500", text: "text-rose-700 dark:text-rose-300", pill: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/30 border-rose-200 dark:border-rose-800/50", iconBg: "bg-rose-500/10 dark:bg-rose-400/10" },
  Tools:          { bg: "bg-rose-500",    text: "text-rose-700 dark:text-rose-300",    pill: "bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-950/50 dark:to-rose-900/30 border-rose-200 dark:border-rose-800/50", iconBg: "bg-rose-500/10 dark:bg-rose-400/10" },
};

const defaultColor = { bg: "bg-slate-500", text: "text-slate-700 dark:text-slate-300", pill: "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950/50 dark:to-slate-900/30 border-slate-200 dark:border-slate-800/50", iconBg: "bg-slate-500/10 dark:bg-slate-400/10" };

function SkillPill({ skill, index, color }: { skill: Skill; index: number; color: typeof defaultColor }) {
  const logo = getSkillLogo(skill.name);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      whileHover={{ scale: 1.05, y: -2 }}
      className={`group inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 shadow-sm hover:shadow-lg transition-all duration-200 cursor-default ${color.pill}`}
    >
      {/* Icon with colored background */}
      <span className={`flex items-center justify-center w-7 h-7 rounded-lg ${color.iconBg} transition-transform group-hover:scale-110`}>
        {logo || <Code2 className="w-4 h-4 text-slate-500 dark:text-slate-400" />}
      </span>
      {/* Tech name */}
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
        {skill.name}
      </span>
    </motion.div>
  );
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = useMemo(() => {
    const map = new Map<string, Skill[]>();
    skills.forEach((skill) => {
      const cat = skill.category?.name || "Other";
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(skill);
    });
    // Sort categories by defined order - Backend first
    return Array.from(map.entries()).sort((a, b) => {
      const indexA = categoryOrder.indexOf(a[0]);
      const indexB = categoryOrder.indexOf(b[0]);
      return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
  }, [skills]);

  const [activeCategory, setActiveCategory] = useState(categories[0]?.[0] || "Backend");

  if (categories.length === 0) return null;

  const activeSkills = categories.find(([c]) => c === activeCategory)?.[1] || [];
  const activeColor = categoryColors[activeCategory] || defaultColor;

  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <motion.div className="mb-4 flex justify-center" initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: 0.1 }}>
            <div className="flex items-center gap-2 rounded-full border border-blue-400/30 dark:border-blue-500/20 bg-blue-100/50 dark:bg-blue-500/5 px-4 py-1.5">
              <Code2 className="size-4 text-blue-600 dark:text-blue-400/70" />
              <span className="text-xs font-semibold uppercase tracking-widest text-blue-600 dark:text-blue-400/70">Tech Stack</span>
            </div>
          </motion.div>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 dark:from-blue-300 dark:via-cyan-400 dark:to-blue-300 bg-clip-text text-transparent">Skills</span>{" "}
            <span className="text-slate-700 dark:text-slate-200">& Technologies</span>
          </h2>
          <motion.div initial={{ width: 0 }} whileInView={{ width: 90 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }} className="mx-auto mt-4 h-0.5 rounded-full bg-gradient-to-r from-blue-500/60 via-cyan-500/40 to-blue-500/60" />
          <motion.p className="mx-auto mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-400" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.4 }}>
            Technologies and tools I use to bring ideas to life
          </motion.p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8 flex flex-wrap justify-center gap-2">
          {categories.map(([category, catSkills]) => {
            const color = categoryColors[category] || defaultColor;
            const isActive = activeCategory === category;
            return (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${isActive ? `${color.bg} text-white shadow-md` : "border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"}`}
              >
                {category} ({catSkills.length})
              </button>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div key={activeCategory} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap justify-center gap-3">
            {activeSkills.map((skill, index) => (
              <SkillPill key={skill.id} skill={skill} index={index} color={activeColor} />
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="mt-12 flex justify-center gap-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{skills.length}</div>
            <div className="text-xs text-slate-500">Technologies</div>
          </div>
          <div className="h-10 w-px bg-slate-200 dark:bg-slate-700" />
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-800 dark:text-white">{categories.length}</div>
            <div className="text-xs text-slate-500">Categories</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
