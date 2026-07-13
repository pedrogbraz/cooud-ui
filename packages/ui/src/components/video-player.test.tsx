import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createRef } from "react";
import { afterEach, beforeEach, describe, expect, it, type MockInstance, vi } from "vitest";
import { axe } from "vitest-axe";
import { VideoPlayer, type VideoPlayerProps } from "./video-player.js";

// jsdom does not implement HTMLMediaElement playback (play/pause throw "not
// implemented"), so both are stubbed; property state (muted, volume,
// playbackRate, currentTime) IS implemented by jsdom and asserted directly.
let playSpy: MockInstance<HTMLMediaElement["play"]>;
let pauseSpy: MockInstance<HTMLMediaElement["pause"]>;

beforeEach(() => {
  playSpy = vi
    .spyOn(HTMLMediaElement.prototype, "play")
    .mockImplementation(() => Promise.resolve());
  pauseSpy = vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

function renderPlayer(props: Partial<VideoPlayerProps> = {}) {
  return render(
    <VideoPlayer src="/media/launch.mp4" poster="/media/launch.jpg" {...props}>
      <track kind="captions" srcLang="en" label="English" src="/media/launch.en.vtt" />
    </VideoPlayer>,
  );
}

function getVideo(container: HTMLElement): HTMLVideoElement {
  const video = container.querySelector("video");
  if (!video) throw new Error("video element not found");
  return video;
}

function getRoot(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('[data-slot="video-player"]');
  if (!root) throw new Error("video-player root not found");
  return root;
}

/** Marks the media element as actively playing (jsdom's `paused` is a readonly accessor). */
function startPlayback(video: HTMLVideoElement) {
  Object.defineProperty(video, "paused", { configurable: true, get: () => false });
  fireEvent(video, new Event("play"));
}

describe("VideoPlayer", () => {
  it("renders the video with src, poster, and media children", () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    expect(video).toHaveAttribute("src", "/media/launch.mp4");
    expect(video).toHaveAttribute("poster", "/media/launch.jpg");
    expect(video.querySelector('track[kind="captions"]')).toBeInTheDocument();
    expect(getRoot(container)).toBeInTheDocument();
  });

  it("shows two play affordances while paused and calls play() on click", async () => {
    renderPlayer();
    // Center overlay + control-bar toggle both read "Play" while paused.
    const playButtons = screen.getAllByRole("button", { name: "Play" });
    expect(playButtons).toHaveLength(2);
    await userEvent.click(playButtons[0] as HTMLElement);
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it("hides the overlay while playing and calls pause() from the toggle", async () => {
    const { container } = renderPlayer();
    startPlayback(getVideo(container));

    // No "Play"-labelled buttons remain: overlay unmounted, toggle now "Pause".
    expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Pause" }));
    expect(pauseSpy).toHaveBeenCalledTimes(1);
  });

  it("returns to the paused UI when playback ends", () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    startPlayback(video);
    expect(screen.queryByRole("button", { name: "Play" })).not.toBeInTheDocument();

    fireEvent(video, new Event("ended"));
    expect(screen.getAllByRole("button", { name: "Play" })).toHaveLength(2);
  });

  it("toggles the muted property and swaps the mute label", async () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    expect(video.muted).toBe(false);

    await userEvent.click(screen.getByRole("button", { name: "Mute" }));
    expect(video.muted).toBe(true);

    await userEvent.click(screen.getByRole("button", { name: "Unmute" }));
    expect(video.muted).toBe(false);
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
  });

  it("seeks the video from the seek slider and updates the readout", () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    Object.defineProperty(video, "duration", { configurable: true, get: () => 120 });
    fireEvent(video, new Event("loadedmetadata"));
    expect(screen.getByText("0:00 / 2:00")).toBeInTheDocument();

    fireEvent.change(screen.getByRole("slider", { name: "Seek" }), { target: { value: "63" } });
    expect(video.currentTime).toBe(63);
    expect(screen.getByText("1:03 / 2:00")).toBeInTheDocument();
  });

  it("follows timeupdate events from the media element", () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    Object.defineProperty(video, "duration", { configurable: true, get: () => 120 });
    fireEvent(video, new Event("loadedmetadata"));

    video.currentTime = 90;
    fireEvent(video, new Event("timeupdate"));
    expect(screen.getByText("1:30 / 2:00")).toBeInTheDocument();
  });

  it("formats hour-plus media with an hour segment (h:mm:ss)", () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    // 96m30s course lesson: must read 1:36:30, not 96:30.
    Object.defineProperty(video, "duration", { configurable: true, get: () => 5790 });
    fireEvent(video, new Event("loadedmetadata"));
    expect(screen.getByText("0:00 / 1:36:30")).toBeInTheDocument();

    video.currentTime = 5400;
    fireEvent(video, new Event("timeupdate"));
    expect(screen.getByText("1:30:00 / 1:36:30")).toBeInTheDocument();

    // Sub-hour minutes stay zero-padded after the hour segment appears.
    video.currentTime = 3661;
    fireEvent(video, new Event("timeupdate"));
    expect(screen.getByText("1:01:01 / 1:36:30")).toBeInTheDocument();
  });

  it("guards a NaN duration and keeps the readout at 0:00", () => {
    const { container } = renderPlayer();
    // jsdom reports duration as NaN by default — exactly the guard under test.
    fireEvent(getVideo(container), new Event("loadedmetadata"));
    expect(screen.getByText("0:00 / 0:00")).toBeInTheDocument();
  });

  it("cycles the playback rate 1x → 1.25x → 1.5x → 2x → 1x", async () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    const rateButton = screen.getByRole("button", { name: "Playback speed, 1x" });
    expect(rateButton).toHaveTextContent("1x");

    await userEvent.click(rateButton);
    expect(video.playbackRate).toBe(1.25);
    expect(rateButton).toHaveTextContent("1.25x");

    await userEvent.click(rateButton);
    expect(video.playbackRate).toBe(1.5);
    await userEvent.click(rateButton);
    expect(video.playbackRate).toBe(2);
    await userEvent.click(rateButton);
    expect(video.playbackRate).toBe(1);
    expect(rateButton).toHaveTextContent("1x");
  });

  it("exposes the current rate in the rate button's accessible name (WCAG 2.5.3)", async () => {
    renderPlayer();
    // The visible "1x" text must be part of the accessible name, alongside the
    // (localizable) label, so AT announces the state and voice control matches.
    const rateButton = screen.getByRole("button", { name: "Playback speed, 1x" });

    await userEvent.click(rateButton);
    expect(rateButton).toHaveAccessibleName("Playback speed, 1.25x");
    await userEvent.click(rateButton);
    expect(rateButton).toHaveAccessibleName("Playback speed, 1.5x");
  });

  it("sets the volume from the volume slider and mutes at zero", () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    const volumeSlider = screen.getByRole("slider", { name: "Volume" });

    fireEvent.change(volumeSlider, { target: { value: "0.5" } });
    expect(video.volume).toBe(0.5);
    expect(video.muted).toBe(false);

    fireEvent.change(volumeSlider, { target: { value: "0" } });
    expect(video.muted).toBe(true);
    expect(screen.getByRole("button", { name: "Unmute" })).toBeInTheDocument();
  });

  it("restores the last non-zero volume when unmuting from a zeroed slider", async () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    const volumeSlider = screen.getByRole("slider", { name: "Volume" });

    fireEvent.change(volumeSlider, { target: { value: "0.6" } });
    fireEvent.change(volumeSlider, { target: { value: "0" } });
    expect(video.muted).toBe(true);
    expect(video.volume).toBe(0);

    await userEvent.click(screen.getByRole("button", { name: "Unmute" }));
    expect(video.muted).toBe(false);
    expect(video.volume).toBe(0.6);
    // Icon and accessible name agree again: audible → Volume2, name "Mute".
    const muteButton = screen.getByRole("button", { name: "Mute" });
    expect(muteButton.querySelector("svg.lucide-volume-2")).toBeInTheDocument();
    expect(muteButton.querySelector("svg.lucide-volume-x")).not.toBeInTheDocument();
    expect(screen.getByRole("slider", { name: "Volume" })).toHaveValue("0.6");
  });

  it("falls back to full volume when unmuting from zero with no prior audible level", async () => {
    const { container } = renderPlayer();
    const video = getVideo(container);
    fireEvent.change(screen.getByRole("slider", { name: "Volume" }), { target: { value: "0" } });
    expect(video.muted).toBe(true);

    await userEvent.click(screen.getByRole("button", { name: "Unmute" }));
    expect(video.muted).toBe(false);
    expect(video.volume).toBe(1);
  });

  it("requests fullscreen on the wrapper element", async () => {
    const { container } = renderPlayer();
    const root = getRoot(container);
    // jsdom has no Fullscreen API; stub it on the instance the component targets.
    const requestFullscreen = vi.fn(() => Promise.resolve());
    (root as HTMLElement & { requestFullscreen: () => Promise<void> }).requestFullscreen =
      requestFullscreen;

    await userEvent.click(screen.getByRole("button", { name: "Fullscreen" }));
    expect(requestFullscreen).toHaveBeenCalledTimes(1);
  });

  it("toggles out of fullscreen: flips label/icon on fullscreenchange and calls exitFullscreen", async () => {
    const { container } = renderPlayer();
    const root = getRoot(container);
    const requestFullscreen = vi.fn(() => Promise.resolve());
    (root as HTMLElement & { requestFullscreen: () => Promise<void> }).requestFullscreen =
      requestFullscreen;
    const exitFullscreen = vi.fn(() => Promise.resolve());
    Object.defineProperty(document, "exitFullscreen", {
      configurable: true,
      value: exitFullscreen,
    });

    try {
      const button = screen.getByRole("button", { name: "Fullscreen" });
      expect(button.querySelector("svg.lucide-maximize")).toBeInTheDocument();
      await userEvent.click(button);
      expect(requestFullscreen).toHaveBeenCalledTimes(1);

      // The browser grants fullscreen: the document reflects it and notifies.
      Object.defineProperty(document, "fullscreenElement", {
        configurable: true,
        get: () => root,
      });
      fireEvent(document, new Event("fullscreenchange"));

      const exitButton = screen.getByRole("button", { name: "Exit fullscreen" });
      expect(exitButton.querySelector("svg.lucide-minimize")).toBeInTheDocument();
      expect(exitButton.querySelector("svg.lucide-maximize")).not.toBeInTheDocument();

      await userEvent.click(exitButton);
      expect(exitFullscreen).toHaveBeenCalledTimes(1);
      expect(requestFullscreen).toHaveBeenCalledTimes(1);

      // The browser leaves fullscreen (button or Esc): label/icon flip back.
      Object.defineProperty(document, "fullscreenElement", {
        configurable: true,
        get: () => null,
      });
      fireEvent(document, new Event("fullscreenchange"));
      expect(screen.getByRole("button", { name: "Fullscreen" })).toBeInTheDocument();
    } finally {
      Reflect.deleteProperty(document, "fullscreenElement");
      Reflect.deleteProperty(document, "exitFullscreen");
    }
  });

  it("is keyboard operable: Tab reaches the overlay and Enter plays", async () => {
    renderPlayer();
    await userEvent.tab();
    const overlay = screen.getAllByRole("button", { name: "Play" })[0] as HTMLElement;
    expect(overlay).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    expect(playSpy).toHaveBeenCalledTimes(1);
  });

  it("hands focus to the control-bar toggle when the focused overlay unmounts on play", async () => {
    const { container } = renderPlayer();
    await userEvent.tab();
    const overlay = screen.getAllByRole("button", { name: "Play" })[0] as HTMLElement;
    expect(overlay).toHaveFocus();

    await userEvent.keyboard("{Enter}");
    // The media element confirms playback; the overlay unmounts while focused.
    startPlayback(getVideo(container));

    const toggle = screen.getByRole("button", { name: "Pause" });
    expect(toggle).toHaveFocus();
    expect(document.activeElement).not.toBe(document.body);
  });

  it("does not steal focus when play starts without the overlay owning focus", () => {
    const { container } = renderPlayer();
    const seek = screen.getByRole("slider", { name: "Seek" });
    seek.focus();

    startPlayback(getVideo(container));
    expect(seek).toHaveFocus();
  });

  it("renders localized labels", () => {
    renderPlayer({ labels: { play: "Reproduzir", fullscreen: "Tela cheia" } });
    expect(screen.getAllByRole("button", { name: "Reproduzir" })).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Tela cheia" })).toBeInTheDocument();
    // Unspecified labels keep their English defaults.
    expect(screen.getByRole("button", { name: "Mute" })).toBeInTheDocument();
  });

  it("forwards the root ref and exposes the video element via videoRef", () => {
    const rootRef = createRef<HTMLDivElement>();
    const videoRef = createRef<HTMLVideoElement>();
    render(
      <VideoPlayer ref={rootRef} videoRef={videoRef} src="/media/launch.mp4">
        <track kind="captions" srcLang="en" label="English" src="/media/launch.en.vtt" />
      </VideoPlayer>,
    );
    expect(rootRef.current).toHaveAttribute("data-slot", "video-player");
    expect(videoRef.current).toBeInstanceOf(HTMLVideoElement);
  });

  it("applies the aspect variants", () => {
    const { container, rerender } = renderPlayer();
    expect(getRoot(container)).toHaveClass("aspect-video");

    rerender(
      <VideoPlayer src="/media/launch.mp4" aspect="square">
        <track kind="captions" srcLang="en" label="English" src="/media/launch.en.vtt" />
      </VideoPlayer>,
    );
    expect(getRoot(container)).toHaveClass("aspect-square");

    rerender(
      <VideoPlayer src="/media/launch.mp4" aspect="wide">
        <track kind="captions" srcLang="en" label="English" src="/media/launch.en.vtt" />
      </VideoPlayer>,
    );
    expect(getRoot(container)).toHaveClass("aspect-[21/9]");
  });

  it("keeps the hidden control bar pointer-inert while playing", () => {
    const { container } = renderPlayer();
    const controls = container.querySelector<HTMLElement>('[data-slot="video-player-controls"]');
    if (!controls) throw new Error("controls bar not found");

    // Paused: the bar is revealed and interactive.
    expect(controls).toHaveClass("opacity-100", "pointer-events-auto");
    expect(controls).not.toHaveClass("pointer-events-none");

    startPlayback(getVideo(container));
    // Playing (not hovered/focused): hidden AND pointer-inert, so a first tap
    // on touch reveals the bar instead of activating an invisible control.
    expect(controls).toHaveClass("opacity-0", "pointer-events-none");
    expect(controls).not.toHaveClass("pointer-events-auto");
    // Hover and keyboard focus-within re-enable pointers with the reveal.
    expect(controls).toHaveClass("group-hover/video-player:pointer-events-auto");
    expect(controls).toHaveClass("group-focus-within/video-player:pointer-events-auto");
    expect(controls).toHaveClass("group-focus-within/video-player:opacity-100");
  });

  it("has no axe violations (paused, controls visible)", async () => {
    const { container } = renderPlayer();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no axe violations (playing)", async () => {
    const { container } = renderPlayer();
    startPlayback(getVideo(container));
    expect(await axe(container)).toHaveNoViolations();
  });
});
