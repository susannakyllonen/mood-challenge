"use client";

import React, { useMemo, useState } from "react";
import styled from "styled-components";

const LOCALE = "en-US";
const DATE_FMT_FULL = new Intl.DateTimeFormat(LOCALE, {
  weekday: "short",
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});
function parseYmdUTC(ymd: string) {
  return new Date(`${ymd}T00:00:00Z`);
}

export type MoodEntry = {
  date: string; // YYYY-MM-DD
  value: number; // 1..5
  note?: string;
};

type Props = {
  entry?: MoodEntry; // selected day's entry (optional)
  title?: string; // card title
  maxCollapsedChars?: number; // when exceeded -> collapsible
};

const Card = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.5rem;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 0.75rem;
`;

const Title = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #111827;
`;

const DateText = styled.span`
  font-size: 0.9rem;
  color: #6b7280;
`;

const MoodRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .emoji {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
    background: #fff;
    font-size: 20px;
  }

  .label {
    font-weight: 600;
    color: #111827;
  }
`;

const NoteWrap = styled.div<{ $expanded?: boolean }>`
  background: #fafafa;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 0.75rem;
  color: #111827;
  line-height: 1.5;
  position: relative;

  /* smooth height changes when toggling */
  transition: max-height 0.2s ease;
`;

const NoteText = styled.p<{ $clamped?: boolean }>`
  margin: 0;
  ${({ $clamped }) =>
    $clamped
      ? `
    display: -webkit-box;
    -webkit-line-clamp: 4; /* show ~4 lines collapsed */
    -webkit-box-orient: vertical;
    overflow: hidden;
  `
      : ``}
`;

const ToggleBtn = styled.button`
  margin-top: 0.5rem;
  border: none;
  background: transparent;
  color: #4f46e5;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

// Map numeric mood (1..5) to emoji + text label
function moodToEmoji(value?: number) {
  switch (value) {
    case 5:
      return { emoji: "😄", label: "Very good" };
    case 4:
      return { emoji: "🙂", label: "Good" };
    case 3:
      return { emoji: "😐", label: "Okay" };
    case 2:
      return { emoji: "🙁", label: "Bad" };
    case 1:
      return { emoji: "😞", label: "Very bad" };
    default:
      return { emoji: "—", label: "No entry" };
  }
}

export default function CalendarDayCard({
  entry,
  title = "Selected day",
  maxCollapsedChars = 140,
}: Props) {
  const [expanded, setExpanded] = useState(false);

  const { emoji, label } = moodToEmoji(entry?.value);

  const formattedDate = useMemo(() => {
    if (!entry?.date) return "";
    return DATE_FMT_FULL.format(parseYmdUTC(entry.date));
  }, [entry?.date]);

  const note = entry?.note ?? "";
  const isLong = note.length > maxCollapsedChars;

  // If collapsed and long, we still clamp visually with CSS; button toggles state.
  const showToggle = Boolean(note) && isLong;

  return (
    <Card aria-live="polite">
      <HeaderRow>
        <Title>{title}</Title>
        <DateText>{formattedDate}</DateText>
      </HeaderRow>

      <MoodRow>
        <span className="emoji" aria-hidden>
          {emoji}
        </span>
        <span className="label">{label}</span>
      </MoodRow>

      {note ? (
        <NoteWrap $expanded={expanded}>
          <NoteText $clamped={!expanded}>{note}</NoteText>
          {showToggle && (
            <ToggleBtn type="button" onClick={() => setExpanded((v) => !v)}>
              {expanded ? "Show less" : "Show more"}
            </ToggleBtn>
          )}
        </NoteWrap>
      ) : (
        <NoteWrap>
          <NoteText>No note</NoteText>
        </NoteWrap>
      )}
    </Card>
  );
}
