import type { Skill } from "../types/common.type";
import { FaQuestion, FaReact } from "react-icons/fa";
import { FaAngular } from "react-icons/fa";
import { SiSvelte } from "react-icons/si";
import { FaVuejs } from "react-icons/fa";
import type { JSX } from "react";
import { FaAndroid } from "react-icons/fa";

export const setLocalStorage = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const getLocalStorage = (key: string) => {
  return JSON.parse(localStorage.getItem(key) || "{}");
};

export const getSkillIcon = (skill: Skill) => {
  const skillsIconMap: Record<Skill, JSX.Element> = {
    React: <FaReact color="skyblue" />,
    Angular: <FaAngular color="red" />,
    Svelte: <SiSvelte color="orange" />,
    Vue: <FaVuejs color="green" />,
    Android: <FaAndroid color="green" />,
  };

  return skillsIconMap[skill] ?? <FaQuestion color="gray" />;
};

export function getRandomColor() {
  const colors = [
    "#1F2937",
    "#111827",
    "#0F172A",
    "#1E3A8A",
    "#7F1D1D",
    "#14532D",
    "#78350F",
    "#4C1D95",
    "#701A75",
    "#075985",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
