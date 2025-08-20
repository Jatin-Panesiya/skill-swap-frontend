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
