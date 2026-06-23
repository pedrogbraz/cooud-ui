import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import { Alert, AlertDescription, AlertTitle } from "./alert.js";

describe("Alert", () => {
  it("renders its title and description with the default status role", () => {
    render(
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>Your trial ends soon.</AlertDescription>
      </Alert>,
    );
    const alert = screen.getByRole("status");
    expect(alert).toHaveAttribute("data-slot", "alert");
    expect(screen.getByText("Heads up")).toBeInTheDocument();
    expect(screen.getByText("Your trial ends soon.")).toBeInTheDocument();
  });

  it("announces assertively via role=alert for the destructive variant", () => {
    render(
      <Alert variant="destructive">
        <AlertTitle>Payment failed</AlertTitle>
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("respects an explicit role override", () => {
    render(
      <Alert variant="destructive" role="status">
        <AlertTitle>Quiet error</AlertTitle>
      </Alert>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Alert variant="info">
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>Some details here.</AlertDescription>
      </Alert>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
