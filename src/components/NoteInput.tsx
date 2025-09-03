"use client";

import React, { forwardRef, TextareaHTMLAttributes, useId } from "react";
import styled from "styled-components";

const MAX_DEFAULT = 200;

const Wrap = styled.div`
  display: grid;
  gap: 0.35rem;
  width: 100%;
`;

const Label = styled.label`
  margin-top: 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  color: #111827;
`;

const TextArea = styled.textarea<{ $warn?: boolean }>`
  width: 100%;
  min-height: 96px;
  border: 1px solid ${({ $warn }) => ($warn ? "#b91c1c" : "#e5e7eb")};
  border-radius: 12px;
  padding: 0.65rem 0.75rem;
  font-size: 0.95rem;
  line-height: 1.45;
  resize: vertical;
  outline: none;
  background: #fff;
  color: #111827;

  &:focus {
    border-color: ${({ $warn }) => ($warn ? "#b91c1c" : "#4f46e5")};
    box-shadow: 0 0 0 3px
      ${({ $warn }) =>
        $warn ? "rgba(185, 28, 28, .15)" : "rgba(79, 70, 229, .15)"};
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const MetaRow = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`;

const Counter = styled.span<{ $warn?: boolean }>`
  font-size: 12px;
  color: ${({ $warn }) => ($warn ? "#b91c1c" : "#6b7280")};
`;

export type NoteInputProps = {
  label?: string;
  value?: string;
  onChange?: (val: string) => void;
  maxLength?: number; // default 200
  placeholder?: string;
  rows?: number; // default 4
  /** Lisä-ID jos haluat kytkeä ulkoiseen kuvaukseen */
  describedById?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "onChange" | "value">;

const NoteInput = forwardRef<HTMLTextAreaElement, NoteInputProps>(
  (
    {
      label = "Optional note",
      value,
      onChange,
      maxLength = MAX_DEFAULT,
      placeholder = "How are you feeling today? (200 chars)",
      rows = 4,
      describedById,
      id,
      ...rest
    },
    ref
  ) => {
    const autoId = useId();
    const fieldId = id ?? `note-${autoId}`;
    const len = value?.length ?? 0;
    const warn = len >= Math.max(0, maxLength - 10);

    return (
      <Wrap>
        {label && <Label htmlFor={fieldId}>{label}</Label>}

        <TextArea
          id={fieldId}
          ref={ref}
          $warn={warn}
          value={value}
          onChange={(e) => onChange?.(e.target.value.slice(0, 200))}
          maxLength={maxLength}
          placeholder={placeholder}
          rows={rows}
          aria-describedby={describedById}
          aria-invalid={warn && len >= maxLength ? true : undefined}
          {...rest}
        />

        <MetaRow>
          <Counter $warn={warn}>
            {len}/{maxLength}
          </Counter>
        </MetaRow>
      </Wrap>
    );
  }
);

NoteInput.displayName = "NoteInput";
export default NoteInput;
