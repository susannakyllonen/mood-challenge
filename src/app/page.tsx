"use client";

import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import Moodrate from "@/components/MoodRate";
import NoteInput from "@/components/NoteInput";
import SaveBar from "@/components/SaveBar";
import {
  loadData,
  saveData,
  upsertToday,
  getTodayEntry,
  todayKey,
  type StoredData,
  type MoodEntry,
} from "@/lib/moodStorage";
import CalendarHeatMap from "@/components/CalendarHeatMap";
import CalendarDayCard from "@/components/CalendarDayCard";
import TrackProgress from "@/components/TrackProgress";

const Container = styled.main`
  width: 100%;
  max-width: 720px;
  padding: 1.25rem;
`;

const Section = styled.section`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 1rem 1.25rem;
  display: grid;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export default function Page() {
  const [data, setData] = useState<StoredData>({ entries: [], version: 1 });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // UI state for today's form
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");

  const today = todayKey();
  const todayEntry = getTodayEntry(data, today);
  const isUpdate = Boolean(todayEntry);

  useEffect(() => {
    const d = loadData();
    setData(d);
    // If there's an entry for today, preselect it for the detail card
    const hasToday = d.entries.some((e) => e.date === today);
    if (hasToday) setSelectedDate(today);
  }, [today]);

  // Prefill UI from today's entry
  useEffect(() => {
    if (todayEntry) {
      setMood(todayEntry.value);
      setNote(todayEntry.note ?? "");
    } else {
      setMood(null);
      setNote("");
    }
  }, [todayEntry]);

  // Can we save? (require mood + something changed if updating)
  const changed = isUpdate
    ? todayEntry!.value !== mood || (todayEntry!.note ?? "") !== (note ?? "")
    : Boolean(mood !== null || note);

  const ready = Boolean(mood !== null) && changed;

  const handleSave = () => {
    if (mood == null) return;
    const entry: MoodEntry = {
      date: today,
      value: mood,
      note: (note ?? "").slice(0, 200),
    };
    const next = upsertToday(data, entry);
    setData(next);
    saveData(next);
    setSelectedDate(today); // <-- immediately show today's entry in the card
  };

  const byDate = useMemo(() => {
    const m = new Map<string, (typeof data.entries)[number]>();
    for (const e of data.entries) m.set(e.date, e);
    return m;
  }, [data]);

  const selectedEntry = selectedDate ? byDate.get(selectedDate) : undefined;

  return (
    <Container>
      <Header
        title="Mood Challenge"
        subtitle="Log one mood per day with an optional short note. Data is stored locally."
        dateYmd={today}
      />

      <Section>
        <Moodrate value={mood} onChange={setMood} />
        <NoteInput value={note} onChange={setNote} />
        <SaveBar isUpdate={isUpdate} ready={ready} onSave={handleSave} />
      </Section>

      <Section style={{ marginTop: 12 }}>
        <CalendarDayCard
          entry={selectedEntry}
          title="Mood entry"
          maxCollapsedChars={200}
        />
      </Section>

      <Section style={{ marginTop: 16 }}>
        <CalendarHeatMap
          entries={data.entries}
          days={30}
          startWeekOn="mon"
          onSelectDay={(date) => setSelectedDate(date)}
        />
      </Section>

      <Section>
        <TrackProgress entries={data.entries} windowDays={30} />
      </Section>
    </Container>
  );
}
