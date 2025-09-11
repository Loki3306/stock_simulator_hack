export interface LearnItem {
  id: string;
  type: "blog" | "course";
  title: string;
  author: string;
  summary: string;
  createdAt: number;
}
const KEY = "mock_learn";
function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function read(): LearnItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
function write(v: LearnItem[]) {
  localStorage.setItem(KEY, JSON.stringify(v));
}

export function seedLearn() {
  const cur = read();
  if (cur.length) return;
  write([
    {
      id: uid(),
      type: "blog",
      title: "Momentum vs Mean Reversion",
      author: "Alex",
      summary: "Understand two core paradigms of trading strategies.",
      createdAt: Date.now() - 86400000 * 2,
    },
    {
      id: uid(),
      type: "course",
      title: "Your First Strategy",
      author: "Sam",
      summary: "Hands-on course to build a crossover system.",
      createdAt: Date.now() - 86400000 * 5,
    },
    {
      id: uid(),
      type: "blog",
      title: "Risk Management Basics",
      author: "Riley",
      summary: "Stop loss, take profit, and position sizing.",
      createdAt: Date.now() - 86400000 * 1,
    },
  ]);
}

export const learnRepo = {
  list(type?: LearnItem["type"]) {
    const all = read();
    return type ? all.filter((i) => i.type === type) : all;
  },
  create(data: Omit<LearnItem, "id" | "createdAt">) {
    const all = read();
    const it: LearnItem = { ...data, id: uid(), createdAt: Date.now() };
    all.unshift(it);
    write(all);
    return it;
  },
};

if (typeof window !== "undefined") seedLearn();
