import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import NoteInput from "@/components/NoteInput";

describe("NoteInput", () => {
  it("renders a textarea", () => {
    render(<NoteInput value="" onChange={() => {}} />);
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("limits input to 200 characters", () => {
    const onChange = vi.fn();
    render(<NoteInput value="" onChange={onChange} />);
    const textarea = screen.getByRole("textbox");

    fireEvent.change(textarea, { target: { value: "a".repeat(250) } });
    expect(onChange).toHaveBeenCalledWith("a".repeat(200));
  });
});
