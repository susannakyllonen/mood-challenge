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
import MoodEntriesSection from "@/components/MoodEntriesSection";
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

  // UI state for today's form
  const [mood, setMood] = useState<number | null>(null);
  const [note, setNote] = useState<string>("");

  const today = todayKey();
  const todayEntry = getTodayEntry(data, today);
  const isUpdate = Boolean(todayEntry);

  // Load from localStorage on mount
  useEffect(() => {
    setData(loadData());
  }, []);

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
  };

  // Last 7 entries sorted newest first
  const last7 = [...data.entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  return (
    <Container>
      <Header
        title="Mood Challenge"
        subtitle="Log one mood per day with an optional short note. Data is stored locally."
      />

      <Section>
        <Moodrate value={mood} onChange={setMood} />
        <NoteInput value={note} onChange={setNote} />
        <SaveBar isUpdate={isUpdate} ready={ready} onSave={handleSave} />
      </Section>

      <Section>
        <CalendarHeatMap entries={data.entries} days={30} startWeekOn="mon" />
      </Section>

      <MoodEntriesSection today={todayEntry} history={last7} />

      <Section style={{ marginTop: 16, marginBottom: 32 }}>
        <TrackProgress entries={data.entries} windowDays={30} />
      </Section>
    </Container>
  );
}
