"use client";

import React, { useMemo } from "react";
import styled from "styled-components";

// Deterministic formatting to avoid hydration mismatch
const LOCALE = "en-US";
const DATE_FMT = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

function todayKey(d = new Date()) {
  const y = d.getUTCFullYear(); // note UTC to be consistent
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function parseYmdUTC(ymd: string) {
  return new Date(`${ymd}T00:00:00Z`);
}

const Wrapper = styled.header`
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const TitleRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: baseline;
  justify-content: center;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #111827;
`;

const DateBadge = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  color: #4f46e5;
  background: #eef2ff;
  border: 1px solid #e5e7eb;
  padding: 0.25rem 0.5rem;
  border-radius: 999px;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  max-width: 40ch;
  margin: 0 auto;
`;

type HeaderProps = {
  title?: string;
  subtitle?: string;
  /** Date to display as YYYY-MM-DD. Defaults to "today". */
  dateYmd?: string;
  /** Hide the badge if needed */
  showDateBadge?: boolean;
};

export default function Header({
  title = "Mood Challenge",
  subtitle = "Log one mood per day with an optional short note. Data is stored locally.",
  dateYmd,
  showDateBadge = true,
}: HeaderProps) {
  const ymd = dateYmd ?? todayKey(); // always resolve a date

  const formatted = useMemo(() => {
    try {
      return DATE_FMT.format(parseYmdUTC(ymd));
    } catch {
      return ymd; // fallback if parsing fails
    }
  }, [ymd]);

  return (
    <Wrapper>
      <TitleRow>
        <Title>{title}</Title>
        {showDateBadge && <DateBadge>{formatted}</DateBadge>}
      </TitleRow>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Wrapper>
  );
}
