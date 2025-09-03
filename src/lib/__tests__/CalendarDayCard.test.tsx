import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import CalendarDayCard, { MoodEntry } from "@/components/CalendarDayCard";

const entry: MoodEntry = {
  date: "2025-09-01",
  value: 5,
  note: "This is a test note that is longer than 50 characters to trigger show more toggle.",
};

describe("CalendarDayCard", () => {
  it("renders emoji and label", () => {
    render(<CalendarDayCard entry={entry} />);
    expect(screen.getByText("Very good")).toBeInTheDocument();
    expect(screen.getByText("😄")).toBeInTheDocument();
  });

  it("shows note and allows expanding", () => {
    render(<CalendarDayCard entry={entry} maxCollapsedChars={20} />);
    expect(screen.getByText(/This is a test note/)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Show more/ }));
    expect(screen.getByText(/Show less/)).toBeInTheDocument();
  });

  it("shows fallback if no entry", () => {
    render(<CalendarDayCard />);
    expect(screen.getByText("No entry")).toBeInTheDocument();
  });
});
