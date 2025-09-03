"use client";

import React from "react";
import styled from "styled-components";

const Wrapper = styled.header`
  display: grid;
  gap: 0.25rem;
  margin: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: #111827;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: #6b7280;
  max-width: 40ch;
  margin: 0 auto;
`;

type HeaderProps = {
  title?: string;
  subtitle?: string;
};

export default function Header({
  title = "Mood Challenge",
  subtitle = "Log your daily mood with an optional note",
}: HeaderProps) {
  return (
    <Wrapper>
      <Title>{title}</Title>
      {subtitle && <Subtitle>{subtitle}</Subtitle>}
    </Wrapper>
  );
}
