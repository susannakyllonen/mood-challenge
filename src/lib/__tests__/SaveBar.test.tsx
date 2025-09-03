import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import SaveBar from "@/components/SaveBar";

describe("SaveBar", () => {
  it("renders save button", () => {
    render(<SaveBar isUpdate={false} ready={true} onSave={() => {}} />);
    expect(screen.getByRole("button", { name: /Save/i })).toBeInTheDocument();
  });

  it("disables button if not ready", () => {
    render(<SaveBar isUpdate={false} ready={false} onSave={() => {}} />);
    expect(screen.getByRole("button", { name: /Save/i })).toBeDisabled();
  });

  it("calls onSave when clicked", () => {
    const onSave = vi.fn();
    render(<SaveBar isUpdate={false} ready={true} onSave={onSave} />);
    fireEvent.click(screen.getByRole("button", { name: /Save/i }));
    expect(onSave).toHaveBeenCalled();
  });
});
