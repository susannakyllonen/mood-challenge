"use client";

import React from "react";
import styled from "styled-components";

const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0;
`;

const Hint = styled.span`
  font-size: 14px;
  color: #6b7280;
`;

const Button = styled.button<{ $ready?: boolean }>`
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: ${({ $ready }) => ($ready ? "pointer" : "not-allowed")};
  background: ${({ $ready }) => ($ready ? "#4f46e5" : "#e5e7eb")};
  color: ${({ $ready }) => ($ready ? "#fff" : "#6b7280")};
  transition: background 0.15s ease;

  &:hover {
    background: ${({ $ready }) => ($ready ? "#4338ca" : "#e5e7eb")};
  }
`;

type SaveBarProps = {
  /** true if there is already an entry for today */
  isUpdate: boolean;
  /** whether saving is allowed (e.g., mood selected and something changed) */
  ready: boolean;
  /** called when user clicks the button */
  onSave: () => void;
};

export default function SaveBar({ isUpdate, ready, onSave }: SaveBarProps) {
  return (
    <Bar>
      <Hint>
        {isUpdate
          ? "You’ve logged today. Edit and press Update."
          : "Not logged yet."}
      </Hint>
      <Button
        type="button"
        $ready={ready}
        disabled={!ready}
        onClick={onSave}
        aria-disabled={!ready}
      >
        {isUpdate ? "Update" : "Save"}
      </Button>
    </Bar>
  );
}
