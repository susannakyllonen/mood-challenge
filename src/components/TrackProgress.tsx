"use client";

import React, { useMemo } from "react";
import styled from "styled-components";
import type { MoodEntry } from "@/lib/moodStorage";
import { todayKey } from "@/lib/moodStorage";

type Props = {
  entries: MoodEntry[];
  windowDays?: number; // default 30
};

const Card = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.5rem;
`;

const Row = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Title = styled.h3`
  font-weight: 700;
  font-size: 1.05rem;
  color: #111827;
`;

const Meta = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

const Bar = styled.div`
  height: 8px;
  width: 100%;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${({ $pct }) => Math.max(0, Math.min(100, $pct))}%;
  background: #4f46e5;
`;

function lastNDaysKeys(n: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(todayKey(d));
  }
  return keys; // [today, today-1, ...]
}

export default function TrackProgress({ entries, windowDays = 30 }: Props) {
  const { daysLogged, streak, pct } = useMemo(() => {
    const keys = lastNDaysKeys(windowDays);
    const have = new Set(entries.map((e) => e.date));

    const daysLogged = keys.reduce((acc, k) => acc + (have.has(k) ? 1 : 0), 0);

    let streak = 0;
    for (const k of keys) {
      if (have.has(k)) streak++;
      else break;
    }

    const pct = (daysLogged / windowDays) * 100;
    return { daysLogged, streak, pct };
  }, [entries, windowDays]);

  return (
    <Card aria-label="Progress">
      <Row>
        <Title>Progress</Title>
        <Meta>
          {daysLogged}/{windowDays} days • Streak {streak}
        </Meta>
      </Row>
      <Bar>
        <Fill $pct={pct} />
      </Bar>
    </Card>
  );
}
