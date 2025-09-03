import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MoodEntriesSection from "@/components/MoodEntriesSection";
import { MoodEntry } from "@/components/CalendarDayCard";

const today: MoodEntry = {
  date: "2025-09-03",
  value: 5,
  note: "Great day",
};

const history: MoodEntry[] = [
  { date: "2025-09-02", value: 3, note: "Okay day" },
  { date: "2025-09-01", value: 1 },
];

describe("MoodEntriesSection", () => {
  it("renders today's entry card", () => {
    render(<MoodEntriesSection today={today} history={history} />);
    expect(screen.getByText("Today's mood")).toBeInTheDocument();
    expect(screen.getByText("Great day")).toBeInTheDocument();
  });

  it("renders history rows with emoji and date", () => {
    render(<MoodEntriesSection today={today} history={history} />);
    expect(screen.getByText("2025-09-02")).toBeInTheDocument();
    expect(screen.getByText("2025-09-01")).toBeInTheDocument();
    expect(screen.getAllByText(/😐|😞/).length).toBeGreaterThan(0);
  });

  it("expands a history row when clicked", () => {
    render(<MoodEntriesSection today={today} history={history} />);
    const row = screen.getByText("2025-09-02");
    fireEvent.click(row);
    expect(screen.getByText("Okay day")).toBeInTheDocument();
  });

  it("collapses the row when clicked again", () => {
    render(<MoodEntriesSection today={today} history={history} />);
    const row = screen.getByText("2025-09-02");
    fireEvent.click(row); // expand
    fireEvent.click(row); // collapse
    expect(screen.queryByText("Okay day")).not.toBeInTheDocument();
  });

  it("shows 'No entries yet' if history is empty", () => {
    render(<MoodEntriesSection today={today} history={[]} />);
    expect(screen.getByText("No entries yet")).toBeInTheDocument();
  });
});
