import { render, screen, fireEvent } from "@testing-library/react";
import CalendarHeatMap, { MoodEntry } from "@/components/CalendarHeatMap";
import { describe, it, expect, vi } from "vitest";

const entries: MoodEntry[] = [
  { date: "2025-09-01", value: 5 },
  { date: "2025-09-02", value: 3 },
];

describe("CalendarHeatMap", () => {
  it("renders the right amount of cells", () => {
    render(<CalendarHeatMap entries={entries} days={7} />);
    // 7 päivää → 7 celliä
    const cells = screen.getAllByRole("button");
    expect(cells.length).toBe(7);
  });

  it("calls onSelectDay when a cell with an entry is clicked", () => {
    const onSelect = vi.fn();
    render(
      <CalendarHeatMap entries={entries} days={7} onSelectDay={onSelect} />
    );
    const cell = screen.getByTitle(/Very good/);
    fireEvent.click(cell);
    expect(onSelect).toHaveBeenCalledWith("2025-09-01");
  });

  it("shows the legend", () => {
    render(<CalendarHeatMap entries={[]} days={7} />);
    expect(screen.getByText("Very good")).toBeInTheDocument();
    expect(screen.getByText("Very bad")).toBeInTheDocument();
  });
});
