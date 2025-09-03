"use client";

import React, { useMemo } from "react";
import styled from "styled-components";

const LOCALE = "en-US";
const DATE_FMT = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});
function parseYmdUTC(ymd: string) {
  // Safe: 2025-08-05 -> 2025-08-05T00:00:00Z
  return new Date(`${ymd}T00:00:00Z`);
}

export type MoodEntry = {
  date: string; // YYYY-MM-DD
  value: number; // 1..5
  note?: string;
};

type Props = {
  entries: MoodEntry[];
  days?: number; // default 30
  startWeekOn?: "mon" | "sun"; // default "mon"
  onSelectDay?: (date: string) => void; // optional click handler
};

/** Helpers */
function todayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function addDays(date: Date, delta: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + delta);
  return d;
}
function lastNDays(n: number): string[] {
  const arr: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(now, -i);
    arr.push(todayKey(d));
  }
  return arr;
}

/** Color scale: 0 = no entry */
const COLOR_NONE = "#f3f4f6";
const SCALE: Record<number, string> = {
  1: "#fecaca", // Very bad
  2: "#fdba74", // Bad
  3: "#fde047", // Okay
  4: "#86efac", // Good
  5: "#22c55e", // Very good
};

const Wrap = styled.section`
  display: grid;
  gap: 0.5rem;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 1.05rem;
`;

const Heat = styled.div<{ $cols: number }>`
  display: grid;
  grid-auto-flow: column; /* fill by columns */
  grid-template-rows: repeat(7, 14px); /* 7 rows = weekdays */
  grid-auto-columns: 14px;
  column-gap: 4px;
  row-gap: 4px;
`;

const Cell = styled.button<{ $level: 0 | 1 | 2 | 3 | 4 | 5 }>`
  width: 14px;
  height: 14px;
  border-radius: 3px;
  border: 1px solid #e5e7eb;
  background: ${({ $level }) => ($level === 0 ? COLOR_NONE : SCALE[$level])};
  cursor: ${({ $level }) => ($level === 0 ? "default" : "pointer")};
  padding: 0;
  outline: none;

  &:hover {
    filter: brightness(0.95);
  }
`;

const Legend = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
`;

const Swatch = styled.span<{ $level: 0 | 1 | 2 | 3 | 4 | 5 }>`
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 3px;
  background: ${({ $level }) => ($level === 0 ? COLOR_NONE : SCALE[$level])};
`;

const WeekdayCol = styled.div`
  display: grid;
  grid-template-rows: repeat(7, 14px);
  align-items: center;
  gap: 4px;
  font-size: 10px;
  color: #9ca3af;
`;

export default function CalendarHeatMap({
  entries,
  days = 30,
  startWeekOn = "mon",
  onSelectDay,
}: Props) {
  // Map date -> entry
  const byDate = useMemo(() => {
    const m = new Map<string, MoodEntry>();
    for (const e of entries) m.set(e.date, e);
    return m;
  }, [entries]);

  // Last N days (oldest first)
  const dayKeys = useMemo(() => lastNDays(days), [days]);

  // Weekday labels
  const labelsMonFirst = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const labelsSunFirst = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const labels = startWeekOn === "mon" ? labelsMonFirst : labelsSunFirst;

  const tooltipFor = (dateStr: string, entry?: MoodEntry) => {
    const d = parseYmdUTC(dateStr);
    const label = DATE_FMT.format(d); // deterministic: en-US + UTC
    if (!entry) return `${label}: No entry`;
    const text =
      entry.value === 5
        ? "Very good"
        : entry.value === 4
        ? "Good"
        : entry.value === 3
        ? "Okay"
        : entry.value === 2
        ? "Bad"
        : "Very bad";
    return `${label}: ${text}${entry.note ? ` — ${entry.note}` : ""}`;
  };

  const cols = Math.ceil(dayKeys.length / 7);

  return (
    <Wrap>
      <TitleRow>
        <Title>Last {days} days</Title>
      </TitleRow>

      <div
        style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "8px" }}
      >
        <WeekdayCol aria-hidden>
          {labels.map((wd, i) => (
            <span key={i}>{wd}</span>
          ))}
        </WeekdayCol>

        <Heat
          $cols={cols}
          role="grid"
          aria-label={`Mood heatmap for the last ${days} days`}
        >
          {dayKeys.map((dateStr) => {
            const entry = byDate.get(dateStr);
            const val = entry?.value ?? 0;
            const title = tooltipFor(dateStr, entry);
            return (
              <Cell
                key={dateStr}
                title={title}
                $level={(val as 0 | 1 | 2 | 3 | 4 | 5) ?? 0}
                onClick={() => entry && onSelectDay?.(dateStr)}
                aria-label={title}
              />
            );
          })}
        </Heat>
      </div>

      <Legend aria-hidden>
        <span>Less</span>
        <Swatch $level={0} />
        <Swatch $level={1} />
        <Swatch $level={2} />
        <Swatch $level={3} />
        <Swatch $level={4} />
        <Swatch $level={5} />
        <span>More</span>
      </Legend>
    </Wrap>
  );
}
