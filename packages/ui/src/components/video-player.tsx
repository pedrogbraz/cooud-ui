"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from "lucide-react";
import {
  type ChangeEvent,
  forwardRef,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
  type SyntheticEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { cn } from "../lib/cn.js";

const videoPlayerVariants = cva(
  "group/video-player relative isolate w-full overflow-hidden rounded-xl border border-border bg-surface-inset",
  {
    variants: {
      aspect: {
        video: "aspect-video",
        square: "aspect-square",
        wide: "aspect-[21/9]",
      },
    },
    defaultVariants: { aspect: "video" },
  },
);

/** Playback speeds the settings button cycles through, in order. */
const PLAYBACK_RATES = [1, 1.25, 1.5, 2] as const;

export interface VideoPlayerLabels {
  /** Accessible name for the play buttons (center overlay + control bar). */
  play: string;
  /** Accessible name for the pause button. */
  pause: string;
  /** Accessible name for the mute button while audio is audible. */
  mute: string;
  /** Accessible name for the unmute button while audio is muted. */
  unmute: string;
  /** Accessible name for the seek slider. */
  seek: string;
  /** Accessible name for the volume slider. */
  volume: string;
  /** Accessible name for the playback-rate cycle button. */
  settings: string;
  /** Accessible name for the fullscreen button while windowed. */
  fullscreen: string;
  /** Accessible name for the fullscreen button while fullscreen. */
  exitFullscreen: string;
}

const DEFAULT_LABELS: VideoPlayerLabels = {
  play: "Play",
  pause: "Pause",
  mute: "Mute",
  unmute: "Unmute",
  seek: "Seek",
  volume: "Volume",
  settings: "Playback speed",
  fullscreen: "Fullscreen",
  exitFullscreen: "Exit fullscreen",
};

/**
 * Formats seconds as `m:ss`, or `h:mm:ss` from one hour up; NaN, Infinity, and
 * negatives collapse to `0:00`.
 */
function formatTime(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) return "0:00";
  const whole = Math.floor(totalSeconds);
  const hours = Math.floor(whole / 3600);
  const minutes = Math.floor((whole % 3600) / 60);
  const seconds = String(whole % 60).padStart(2, "0");
  if (hours > 0) return `${hours}:${String(minutes).padStart(2, "0")}:${seconds}`;
  return `${minutes}:${seconds}`;
}

const controlButtonClasses =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-md text-fg transition-colors duration-150 hover:bg-surface-overlay outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0";

const rangeClasses =
  "h-1 cursor-pointer appearance-none rounded-full bg-border accent-primary outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base disabled:pointer-events-none disabled:opacity-50 [&::-moz-range-thumb]:size-3 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-primary [&::-webkit-slider-thumb]:size-3 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary";

export interface VideoPlayerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof videoPlayerVariants> {
  /** Video source URL. */
  src: string;
  /** Preview image shown before the first frame is available. */
  poster?: string;
  /** Starts playback automatically once the media can play. @default false */
  autoPlay?: boolean;
  /** Restarts playback from the beginning when the video ends. @default false */
  loop?: boolean;
  /** Starts with the audio muted. @default false */
  muted?: boolean;
  /** Frame aspect ratio: 16:9 (`"video"`), 1:1 (`"square"`) or 21:9 (`"wide"`). @default "video" */
  aspect?: "video" | "square" | "wide";
  /** Control-label overrides for i18n. Every label defaults to English. */
  labels?: Partial<VideoPlayerLabels>;
  /** Ref to the underlying `<video>` element, for imperative control. */
  videoRef?: Ref<HTMLVideoElement>;
  /** Extra media children, e.g. a captions `<track>` or additional `<source>` elements. */
  children?: ReactNode;
}

export const VideoPlayer = forwardRef<HTMLDivElement, VideoPlayerProps>(
  (
    {
      src,
      poster,
      autoPlay = false,
      loop = false,
      muted = false,
      aspect = "video",
      labels,
      videoRef,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const videoElementRef = useRef<HTMLVideoElement | null>(null);
    const overlayPlayRef = useRef<HTMLButtonElement | null>(null);
    const playToggleRef = useRef<HTMLButtonElement | null>(null);
    // Whether the overlay play button owned focus when playback started — set
    // before the state flip that unmounts it, consumed by the focus hand-off
    // effect below.
    const overlayOwnedFocusRef = useRef(false);
    // Last audible slider volume, so unmuting from a zeroed slider restores it.
    const lastAudibleVolumeRef = useRef(1);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);
    const [isMuted, setIsMuted] = useState(muted);
    const [rateIndex, setRateIndex] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const mergedLabels: VideoPlayerLabels = { ...DEFAULT_LABELS, ...labels };
    const playbackRate = PLAYBACK_RATES[rateIndex] ?? 1;
    // While muted the slider reads 0 so unmuting restores the remembered volume.
    const displayedVolume = isMuted ? 0 : volume;

    // Keep the internal ref and the consumer-facing `videoRef` pointing at the
    // same node without nesting `useImperativeHandle` indirection.
    const setVideoNode = useCallback(
      (node: HTMLVideoElement | null) => {
        videoElementRef.current = node;
        if (typeof videoRef === "function") {
          videoRef(node);
        } else if (videoRef) {
          videoRef.current = node;
        }
      },
      [videoRef],
    );

    const togglePlay = useCallback(() => {
      const video = videoElementRef.current;
      if (!video) return;
      if (video.paused || video.ended) {
        // Older engines return undefined instead of a promise; autoplay/gesture
        // policies can reject — the media `pause` event keeps the UI truthful.
        const result = video.play() as Promise<void> | undefined;
        void result?.catch(() => {});
      } else {
        video.pause();
      }
    }, []);

    const toggleMute = useCallback(() => {
      const video = videoElementRef.current;
      if (!video) return;
      video.muted = !video.muted;
      // Unmuting while the volume sits at 0 would be an audio no-op with the
      // icon stuck on VolumeX — restore the last audible volume instead.
      if (!video.muted && video.volume === 0) {
        const restored = lastAudibleVolumeRef.current > 0 ? lastAudibleVolumeRef.current : 1;
        video.volume = restored;
        setVolume(restored);
      }
      // Browsers also fire `volumechange`; setting state here keeps the toggle
      // responsive even when the element swallows the event.
      setIsMuted(video.muted);
    }, []);

    const cyclePlaybackRate = () => {
      const nextIndex = (rateIndex + 1) % PLAYBACK_RATES.length;
      setRateIndex(nextIndex);
      const video = videoElementRef.current;
      if (video) video.playbackRate = PLAYBACK_RATES[nextIndex] ?? 1;
    };

    const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      if (Number.isNaN(next)) return;
      setCurrentTime(next);
      const video = videoElementRef.current;
      if (video) video.currentTime = next;
    };

    const handleVolumeInput = (event: ChangeEvent<HTMLInputElement>) => {
      const next = Number(event.target.value);
      if (Number.isNaN(next)) return;
      const clamped = Math.min(1, Math.max(0, next));
      if (clamped > 0) lastAudibleVolumeRef.current = clamped;
      setVolume(clamped);
      setIsMuted(clamped === 0);
      const video = videoElementRef.current;
      if (video) {
        video.volume = clamped;
        video.muted = clamped === 0;
      }
    };

    const handleTimeUpdate = (event: SyntheticEvent<HTMLVideoElement>) => {
      setCurrentTime(event.currentTarget.currentTime);
    };

    const handleLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>) => {
      const nextDuration = event.currentTarget.duration;
      // Live streams and not-yet-loaded media report NaN/Infinity — keep 0:00.
      setDuration(Number.isFinite(nextDuration) ? nextDuration : 0);
    };

    const handleVolumeChange = (event: SyntheticEvent<HTMLVideoElement>) => {
      const { muted: nextMuted, volume: nextVolume } = event.currentTarget;
      if (nextVolume > 0) lastAudibleVolumeRef.current = nextVolume;
      setIsMuted(nextMuted);
      setVolume(nextVolume);
    };

    const handlePlay = () => {
      // Playing unmounts the overlay play button; remember whether it owned
      // focus so the hand-off effect can move focus instead of dropping it.
      overlayOwnedFocusRef.current =
        overlayPlayRef.current !== null && document.activeElement === overlayPlayRef.current;
      setIsPlaying(true);
    };

    // Focus hand-off: when the focused overlay unmounts on paused→playing,
    // land focus on the control-bar play/pause toggle (which also keeps the
    // control bar revealed via group-focus-within) instead of <body>.
    useLayoutEffect(() => {
      if (isPlaying && overlayOwnedFocusRef.current) {
        overlayOwnedFocusRef.current = false;
        playToggleRef.current?.focus();
      }
    }, [isPlaying]);

    // Track fullscreen membership so the button is a true toggle. `Esc` and
    // browser chrome also exit fullscreen, so state must follow the document.
    useEffect(() => {
      if (typeof document === "undefined") return;
      const syncFullscreen = () => {
        setIsFullscreen(
          containerRef.current !== null && document.fullscreenElement === containerRef.current,
        );
      };
      document.addEventListener("fullscreenchange", syncFullscreen);
      return () => document.removeEventListener("fullscreenchange", syncFullscreen);
    }, []);

    const handleFullscreen = () => {
      const container = containerRef.current;
      if (!container) return;
      if (document.fullscreenElement === container) {
        if (typeof document.exitFullscreen !== "function") return;
        // Older engines return undefined instead of a promise.
        const result = document.exitFullscreen() as Promise<void> | undefined;
        void result?.catch(() => {});
        return;
      }
      if (typeof container.requestFullscreen !== "function") return;
      const result = container.requestFullscreen() as Promise<void> | undefined;
      void result?.catch(() => {});
    };

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        data-slot="video-player"
        className={cn(videoPlayerVariants({ aspect }), className)}
        {...props}
      >
        {/* Captions are the consumer's data: pass a `<track kind="captions">` child. */}
        <video
          ref={setVideoNode}
          data-slot="video-player-video"
          className="absolute inset-0 size-full object-contain"
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          preload="metadata"
          onPlay={handlePlay}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onVolumeChange={handleVolumeChange}
        >
          {children}
        </video>

        {!isPlaying ? (
          <button
            ref={overlayPlayRef}
            type="button"
            data-slot="video-player-overlay-play"
            aria-label={mergedLabels.play}
            onClick={togglePlay}
            className="absolute inset-0 z-10 m-auto flex size-14 items-center justify-center rounded-full border border-border bg-surface-base/85 text-fg shadow-md backdrop-blur-sm transition-transform duration-150 outline-none hover:scale-105 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-surface-base [&_svg]:size-6"
          >
            <Play aria-hidden="true" />
          </button>
        ) : null}

        <div
          data-slot="video-player-controls"
          className={cn(
            "absolute inset-x-0 bottom-0 z-20 flex items-center gap-1.5 border-t border-border bg-surface-base/90 px-2.5 py-2 backdrop-blur-sm",
            // Hidden controls are also pointer-inert so a first tap on a touch
            // device reveals the bar instead of activating an invisible button;
            // hover/focus-within re-enable pointers alongside the reveal.
            "pointer-events-none opacity-0 transition-opacity duration-200",
            "group-focus-within/video-player:pointer-events-auto group-focus-within/video-player:opacity-100",
            "group-hover/video-player:pointer-events-auto group-hover/video-player:opacity-100",
            !isPlaying && "pointer-events-auto opacity-100",
          )}
        >
          <button
            ref={playToggleRef}
            type="button"
            data-slot="video-player-play"
            aria-label={isPlaying ? mergedLabels.pause : mergedLabels.play}
            onClick={togglePlay}
            className={controlButtonClasses}
          >
            {isPlaying ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          </button>

          {/* Times are conventionally LTR even in RTL locales. */}
          <span
            dir="ltr"
            data-slot="video-player-time"
            className="shrink-0 px-1 text-xs tabular-nums text-fg-secondary"
          >
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          <input
            type="range"
            data-slot="video-player-seek"
            aria-label={mergedLabels.seek}
            aria-valuetext={`${formatTime(currentTime)} / ${formatTime(duration)}`}
            min={0}
            max={duration > 0 ? duration : 0}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className={cn(rangeClasses, "min-w-0 flex-1")}
          />

          <button
            type="button"
            data-slot="video-player-rate"
            // Include the visible "1.5x" text so AT announces the current rate
            // and voice-control "click 1.5x" matches (WCAG 2.5.3 label-in-name).
            aria-label={`${mergedLabels.settings}, ${playbackRate}x`}
            onClick={cyclePlaybackRate}
            className={cn(
              controlButtonClasses,
              "w-auto min-w-8 px-1.5 text-xs font-semibold tabular-nums",
            )}
          >
            {playbackRate}x
          </button>

          <button
            type="button"
            data-slot="video-player-mute"
            aria-label={isMuted ? mergedLabels.unmute : mergedLabels.mute}
            onClick={toggleMute}
            className={controlButtonClasses}
          >
            {isMuted || volume === 0 ? (
              <VolumeX aria-hidden="true" />
            ) : (
              <Volume2 aria-hidden="true" />
            )}
          </button>

          <input
            type="range"
            data-slot="video-player-volume"
            aria-label={mergedLabels.volume}
            min={0}
            max={1}
            step={0.05}
            value={displayedVolume}
            onChange={handleVolumeInput}
            className={cn(rangeClasses, "w-16 shrink-0 max-sm:hidden")}
          />

          <button
            type="button"
            data-slot="video-player-fullscreen"
            aria-label={isFullscreen ? mergedLabels.exitFullscreen : mergedLabels.fullscreen}
            onClick={handleFullscreen}
            className={controlButtonClasses}
          >
            {isFullscreen ? <Minimize aria-hidden="true" /> : <Maximize aria-hidden="true" />}
          </button>
        </div>
      </div>
    );
  },
);
VideoPlayer.displayName = "VideoPlayer";

export { videoPlayerVariants };
