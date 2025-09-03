"use client";

import React from "react";
import styled from "styled-components";

type MoodOption = {
  label: string;
  emoji: string;
  value: number;
};

const MOODS: MoodOption[] = [
  { label: "Very bad", emoji: "😞", value: 1 },
  { label: "Bad", emoji: "🙁", value: 2 },
  { label: "Okay", emoji: "😐", value: 3 },
  { label: "Good", emoji: "🙂", value: 4 },
  { label: "Very good", emoji: "😄", value: 5 },
];

const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
`;

const Options = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
`;

const Option = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  width: 70px;
  height: 70px;
  border-radius: 12px;
  border: 2px solid ${({ $active }) => ($active ? "#4f46e5" : "#e5e7eb")};
  background: ${({ $active }) => ($active ? "#eef2ff" : "#fff")};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.15s ease;

  span {
    font-size: 0.8rem;
    color: ${({ $active }) => ($active ? "#4f46e5" : "#374151")};
  }

  &:hover {
    transform: translateY(-2px);
    border-color: #4f46e5;
  }
`;

type MoodrateProps = {
  value: number | null;
  onChange: (val: number) => void;
};

export default function Moodrate({ value, onChange }: MoodrateProps) {
  return (
    <Wrapper>
      <Title>How are you feeling today?</Title>
      <Options>
        {MOODS.map((mood) => (
          <Option
            key={mood.value}
            $active={value === mood.value}
            onClick={() => onChange(mood.value)}
            type="button"
          >
            {mood.emoji}
            <span>{mood.label}</span>
          </Option>
        ))}
      </Options>
    </Wrapper>
  );
}
