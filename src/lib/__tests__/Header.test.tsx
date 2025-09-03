import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Header from "@/components/Header";

describe("Header", () => {
  it("renders title and subtitle", () => {
    render(
      <Header
        title="Mood Challenge"
        subtitle="Test subtitle"
        dateYmd="2025-09-03"
      />
    );
    expect(screen.getByText("Mood Challenge")).toBeInTheDocument();
    expect(screen.getByText("Test subtitle")).toBeInTheDocument();
  });

  it("shows date if given", () => {
    render(
      <Header
        title="Mood Challenge"
        subtitle="Track your day"
        dateYmd="2025-09-03"
      />
    );
    expect(screen.getByText(/Sep/)).toBeInTheDocument();
  });
});
