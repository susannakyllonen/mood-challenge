"use client";

import React, { useState } from "react";
import Header from "../components/Header";
import Moodrate from "@/components/MoodRate";
import NoteInput from "@/components/NoteInput";

export default function Home() {
  const [mood, setMood] = React.useState<number | null>(null);
  const [note, setNote] = useState("");

  return (
    <main>
      <Header />
      <Moodrate value={mood} onChange={setMood} />
      <NoteInput value={note} onChange={setNote} />
    </main>
  );
}
