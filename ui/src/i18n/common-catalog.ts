import { useEffect, useState } from "react";

export const LOCALE_STORAGE_KEY = "paperclip.locale";
export type UiLocale = "en" | "zh-CN";

const NAV_EXTRAS: Record<string, string> = {
  Search: "搜索",
  Dashboard: "仪表盘",
  Inbox: "收件箱",
  unread: "未读",
  Decisions: "决策",
  Status: "状态",
  "Conference Room": "会议室",
  Work: "工作",
  Tasks: "任务",
  Cases: "案例",
  Routines: "例行任务",
  Pipelines: "流水线",
  Goals: "目标",
  Artifacts: "产物",
  Skills: "技能",
  Workspaces: "工作区",
  Projects: "项目",
  Organization: "组织",
  Org: "组织",
  Apps: "应用",
  Timeline: "时间线",
  Costs: "费用",
  Activity: "动态",
  Settings: "设置",
  Agents: "智能体",
  beta: "测试",
};

let catalog: Record<string, string> = {};
let currentLocale: UiLocale = "zh-CN";
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

export function getUiLocale(): UiLocale {
  return currentLocale;
}

export function detectUiLocale(): UiLocale {
  if (typeof window === "undefined") return "zh-CN";
  const query = new URLSearchParams(window.location.search).get("lng");
  if (query === "en" || query === "zh-CN") return query;
  try {
    const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === "en" || stored === "zh-CN") return stored;
  } catch {
    // ignore
  }
  const language = (window.navigator.language || "").toLowerCase();
  if (language.startsWith("zh")) return "zh-CN";
  if (import.meta.env.MODE === "test") return "en";
  return "zh-CN";
}

export async function loadCommonCatalog(locale: UiLocale) {
  currentLocale = locale;
  if (locale === "en") {
    catalog = {};
    notify();
    return;
  }
  const response = await fetch(`/locales/${locale}/common.json`);
  if (!response.ok) {
    catalog = { ...NAV_EXTRAS };
    notify();
    return;
  }
  const data = (await response.json()) as Record<string, string>;
  catalog = { ...data, ...NAV_EXTRAS };
  notify();
}

export function tc(english: string) {
  if (currentLocale === "en") return english;
  return catalog[english] ?? NAV_EXTRAS[english] ?? english;
}

export function subscribeLocale(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function useUiLocale() {
  const [locale, setLocale] = useState<UiLocale>(getUiLocale);
  useEffect(() => subscribeLocale(() => setLocale(getUiLocale())), []);
  return { locale, tc };
}
