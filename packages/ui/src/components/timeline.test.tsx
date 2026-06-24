import { render, screen, within } from "@testing-library/react";
import { GitCommit } from "lucide-react";
import { describe, expect, it } from "vitest";
import { axe } from "vitest-axe";
import {
  Timeline,
  TimelineContent,
  TimelineDescription,
  TimelineDot,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "./timeline.js";

const EVENTS = [
  { title: "Order placed", time: "2026-06-21", label: "Jun 21", desc: "Awaiting payment." },
  { title: "Payment captured", time: "2026-06-22", label: "Jun 22", desc: "Charged to card." },
  { title: "Order shipped", time: "2026-06-23", label: "Jun 23", desc: "Left the warehouse." },
] as const;

function Feed() {
  return (
    <Timeline aria-label="Order history">
      {EVENTS.map((event, index) => (
        <TimelineItem key={event.title}>
          <TimelineDot tone={index === EVENTS.length - 1 ? "success" : "default"} />
          <TimelineContent>
            <TimelineTitle>{event.title}</TimelineTitle>
            <TimelineTime dateTime={event.time}>{event.label}</TimelineTime>
            <TimelineDescription>{event.desc}</TimelineDescription>
          </TimelineContent>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

describe("Timeline", () => {
  it("renders an ordered list with one item per event", () => {
    render(<Feed />);
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("OL");
    expect(within(list).getAllByRole("listitem")).toHaveLength(3);
  });

  it("renders each event's title, description and time", () => {
    render(<Feed />);
    for (const event of EVENTS) {
      expect(screen.getByText(event.title)).toBeInTheDocument();
      expect(screen.getByText(event.desc)).toBeInTheDocument();
    }
    // The time renders as a real <time> with a machine-readable dateTime.
    const shipped = screen.getByText("Jun 23");
    expect(shipped.tagName).toBe("TIME");
    expect(shipped).toHaveAttribute("datetime", "2026-06-23");
  });

  it("applies the dot tone via data + token class", () => {
    const { container } = render(<Feed />);
    const dots = container.querySelectorAll('[data-slot="timeline-dot"]');
    expect(dots).toHaveLength(3);
    expect(dots[0]).toHaveAttribute("data-tone", "default");
    expect(dots[0]).toHaveClass("bg-fg-tertiary");
    expect(dots[2]).toHaveAttribute("data-tone", "success");
    expect(dots[2]).toHaveClass("bg-success");
  });

  it("renders a ring-bordered chip when the dot has an icon", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineDot tone="primary" icon={<GitCommit />} />
          <TimelineContent>
            <TimelineTitle>Pushed a commit</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    const dot = container.querySelector('[data-slot="timeline-dot"]');
    expect(dot).toHaveClass("border", "border-primary/30", "text-primary");
    expect(dot?.querySelector("svg")).toBeInTheDocument();
  });

  it("draws a connector between consecutive items but not after the last", () => {
    const { container } = render(<Feed />);
    const items = container.querySelectorAll('[data-slot="timeline-item"]');
    const hasConnector = (item: Element) =>
      item.querySelector('[data-slot="timeline-connector"]') !== null;
    // First two items connect down to the next event; the final item's rail ends.
    expect(hasConnector(items[0])).toBe(true);
    expect(hasConnector(items[1])).toBe(true);
    expect(hasConnector(items[2])).toBe(false);
    expect(container.querySelectorAll('[data-slot="timeline-connector"]')).toHaveLength(2);
  });

  it("hides the decorative connector from assistive tech", () => {
    const { container } = render(<Feed />);
    for (const line of container.querySelectorAll('[data-slot="timeline-connector"]')) {
      expect(line).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("respects an explicit connector override on the last item", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineTitle>Only event</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
        <TimelineItem connector>
          <TimelineContent>
            <TimelineTitle>Ongoing…</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    // The last item normally drops its connector, but the explicit prop keeps it.
    expect(container.querySelectorAll('[data-slot="timeline-connector"]')).toHaveLength(2);
  });

  it("renders a default dot when an item omits one", () => {
    const { container } = render(
      <Timeline>
        <TimelineItem>
          <TimelineContent>
            <TimelineTitle>No explicit dot</TimelineTitle>
          </TimelineContent>
        </TimelineItem>
      </Timeline>,
    );
    const dot = container.querySelector('[data-slot="timeline-dot"]');
    expect(dot).toHaveAttribute("data-tone", "default");
  });

  it("has no axe violations", async () => {
    const { container } = render(<Feed />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
