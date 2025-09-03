import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MoodRate from "@/components/MoodRate";

describe("MoodRate", () => {
  it("renders 5 mood options", () => {
    render(<MoodRate value={null} onChange={() => {}} />);
    expect(screen.getAllByRole("button").length).toBe(5);
  });

  it("calls onChange when option is clicked", () => {
    const onChange = vi.fn();
    render(<MoodRate value={null} onChange={onChange} />);
    const button = screen.getByRole("button", { name: /Very good/ });
    fireEvent.click(button);
    expect(onChange).toHaveBeenCalledWith(5);
  });
});
