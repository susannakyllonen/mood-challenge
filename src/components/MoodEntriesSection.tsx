"use client";

import { useState } from "react";
import styled from "styled-components";
import CalendarDayCard, { MoodEntry } from "@/components/CalendarDayCard";

const Section = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 1rem;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-top: 1px solid #f3f4f6;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

const Emoji = styled.span`
  font-size: 20px;
`;

const DateLabel = styled.span`
  font-size: 14px;
  color: #374151;
`;

const NoteMark = styled.span`
  font-size: 12px;
  color: #6b7280;
`;

type Props = {
  today: MoodEntry | undefined;
  history: MoodEntry[];
};

export default function MoodEntriesSection({ today, history }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const moodEmoji = (value: number) => {
    switch (value) {
      case 5:
        return "😄";
      case 4:
        return "🙂";
      case 3:
        return "😐";
      case 2:
        return "🙁";
      case 1:
        return "😞";
      default:
        return "—";
    }
  };

  return (
    <Section>
      <h3>Today</h3>
      <CalendarDayCard
        entry={today}
        title="Today's mood"
        maxCollapsedChars={200}
      />

      <h3>History</h3>
      {history.length === 0 && <p>No entries yet</p>}
      {history.map((entry) => {
        const isExpanded = expanded === entry.date;
        return (
          <div key={entry.date}>
            <Row onClick={() => setExpanded(isExpanded ? null : entry.date)}>
              <Emoji>{moodEmoji(entry.value)}</Emoji>
              <DateLabel>{entry.date}</DateLabel>
              {entry.note && <NoteMark>⬇️</NoteMark>}
            </Row>
            {isExpanded && (
              <CalendarDayCard
                entry={entry}
                title={entry.date}
                maxCollapsedChars={200}
              />
            )}
          </div>
        );
      })}
    </Section>
  );
}
