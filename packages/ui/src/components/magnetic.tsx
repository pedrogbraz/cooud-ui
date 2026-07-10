"use client";

import {
  forwardRef,
  type HTMLAttributes,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { cn } from "../lib/cn.js";

export interface MagneticProps extends HTMLAttributes<HTMLDivElement> {
  /**
   * How strongly the content is pulled toward the pointer, as a fraction of
   * the pointer's offset from the wrapper's center. `0` is inert, `1` glues
   * the content to the cursor. Values outside `0–1` are clamped.
   * @default 0.3
   */
  strength?: number;
  /**
   * Radius of the magnetic field in pixels, measured from the wrapper's
   * center. The pull is strongest near the center and eases back to zero at
   * this distance, so crossing the field's edge never pops. Pad the wrapper
   * (e.g. `className="p-10"`) to give the field room beyond the content's own
   * box — the attraction can only be felt where the wrapper is hovered.
   * @default 120
   */
  radius?: number;
}

const DEFAULT_STRENGTH = 0.3;
const DEFAULT_RADIUS = 120;
/** Fraction of the remaining distance covered per frame — the lerp smoothing. */
const FOLLOW = 0.35;
/** Distance (px) below which the lerp is considered settled and the loop stops. */
const SETTLE = 0.05;

/** Mutable per-instance interaction state, kept in a ref so pointer tracking never re-renders. */
interface MagneticState {
  active: boolean;
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
}

/**
 * The effect is decorative, so it steps aside for visitors who ask for less
 * motion and on touch/coarse-pointer devices, where there is no hover to
 * attract toward. Evaluated on every pointer-enter (not once at mount) so a
 * live OS-setting change is honoured on the very next interaction.
 */
const canAttract = (): boolean =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
  !window.matchMedia("(pointer: coarse)").matches;

/**
 * Re-entering mid-spring-back: seed the lerp from the element's live computed
 * transform so the new pull continues from wherever the ease-back had reached,
 * instead of jumping to the stale resting position.
 */
function seedFromComputedTransform(target: HTMLElement, state: MagneticState) {
  state.x = 0;
  state.y = 0;
  const transform = window.getComputedStyle(target).transform;
  const match = /matrix(3d)?\(([^)]+)\)/.exec(transform ?? "");
  if (!match) {
    return;
  }
  const parts = (match[2] ?? "").split(",");
  const [tx, ty] = match[1]
    ? [Number.parseFloat(parts[12] ?? "0"), Number.parseFloat(parts[13] ?? "0")]
    : [Number.parseFloat(parts[4] ?? "0"), Number.parseFloat(parts[5] ?? "0")];
  if (Number.isFinite(tx) && Number.isFinite(ty)) {
    state.x = tx;
    state.y = ty;
  }
}

/**
 * A magnetic-hover wrapper: its children are gently attracted toward the
 * cursor while it is inside a proximity field around the wrapper's center.
 * Classic use is a hero call-to-action or an icon row that leans into the
 * pointer before it even lands.
 *
 * Mechanism: `pointermove` on the wrapper records the cursor, and a
 * `requestAnimationFrame` loop lerps a `translate` that is written **straight
 * to the child's `style.transform`** — pointer tracking never touches React
 * state, so there are zero re-renders during the interaction. The pull is the
 * pointer's offset from center scaled by {@link MagneticProps.strength} and by
 * a linear falloff that reaches zero at {@link MagneticProps.radius}, so the
 * attraction dissolves smoothly at the field's edge. On leave the transform is
 * reset to zero and a short springy CSS transition (suppressed while tracking
 * via a `data-magnetic-active` attribute) eases the content back to rest.
 *
 * The effect is disabled entirely under `prefers-reduced-motion: reduce` and
 * on coarse pointers (`(pointer: coarse)` — touch has no hover to attract
 * toward), with a `motion-reduce` CSS backstop on the transform itself.
 * Accessibility: purely decorative — the wrapper is not a control, children
 * keep their natural focus order and focus-visible styling, and keyboard users
 * simply see the content at rest.
 */
export const Magnetic = forwardRef<HTMLDivElement, MagneticProps>(
  (
    {
      strength = DEFAULT_STRENGTH,
      radius = DEFAULT_RADIUS,
      className,
      children,
      onPointerEnter,
      onPointerMove,
      onPointerLeave,
      ...props
    },
    ref,
  ) => {
    const wrapperRef = useRef<HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLDivElement | null>(null);
    const frameRef = useRef<number | null>(null);
    const stateRef = useRef<MagneticState>({
      active: false,
      pointerX: 0,
      pointerY: 0,
      x: 0,
      y: 0,
    });

    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        wrapperRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const step = useCallback(() => {
      frameRef.current = null;
      const wrapper = wrapperRef.current;
      const target = targetRef.current;
      const state = stateRef.current;
      if (!wrapper || !target || !state.active) {
        return;
      }
      const rect = wrapper.getBoundingClientRect();
      const offsetX = state.pointerX - (rect.left + rect.width / 2);
      const offsetY = state.pointerY - (rect.top + rect.height / 2);
      const field = Math.max(radius, 1);
      const distance = Math.hypot(offsetX, offsetY);
      // Pull grows with the offset near the center but eases back to zero at
      // the field's edge, so entering/leaving the radius never jumps.
      const falloff = distance >= field ? 0 : 1 - distance / field;
      const pull = Math.min(Math.max(strength, 0), 1) * falloff;
      const targetX = offsetX * pull;
      const targetY = offsetY * pull;
      state.x += (targetX - state.x) * FOLLOW;
      state.y += (targetY - state.y) * FOLLOW;
      target.style.transform = `translate(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px)`;
      // Keep lerping until the follow has settled; a new pointermove restarts it.
      if (Math.abs(targetX - state.x) > SETTLE || Math.abs(targetY - state.y) > SETTLE) {
        frameRef.current = requestAnimationFrame(step);
      }
    }, [strength, radius]);

    const handlePointerEnter = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const target = targetRef.current;
        if (target && canAttract()) {
          const state = stateRef.current;
          state.active = true;
          state.pointerX = event.clientX;
          state.pointerY = event.clientY;
          seedFromComputedTransform(target, state);
          // While tracking, the rAF lerp is the smoothing — the CSS transition
          // (which would only add lag on top) is suppressed via this attribute.
          target.setAttribute("data-magnetic-active", "true");
        }
        onPointerEnter?.(event);
      },
      [onPointerEnter],
    );

    const handlePointerMove = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const state = stateRef.current;
        if (state.active) {
          state.pointerX = event.clientX;
          state.pointerY = event.clientY;
          if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
          }
          frameRef.current = requestAnimationFrame(step);
        }
        onPointerMove?.(event);
      },
      [step, onPointerMove],
    );

    const handlePointerLeave = useCallback(
      (event: ReactPointerEvent<HTMLDivElement>) => {
        const state = stateRef.current;
        if (state.active) {
          state.active = false;
          state.x = 0;
          state.y = 0;
          if (frameRef.current !== null) {
            cancelAnimationFrame(frameRef.current);
            frameRef.current = null;
          }
          const target = targetRef.current;
          if (target) {
            // Drop the tracking attribute first so the class transition is
            // live when the zero transform lands — that transition IS the
            // spring-back.
            target.removeAttribute("data-magnetic-active");
            target.style.transform = "translate(0px, 0px)";
          }
        }
        onPointerLeave?.(event);
      },
      [onPointerLeave],
    );

    // Cancel any in-flight frame if the wrapper unmounts mid-attraction.
    useEffect(
      () => () => {
        if (frameRef.current !== null) {
          cancelAnimationFrame(frameRef.current);
        }
      },
      [],
    );

    return (
      <div
        ref={setRef}
        data-slot="magnetic"
        className={cn("inline-block", className)}
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        {...props}
      >
        <div
          ref={targetRef}
          data-slot="magnetic-target"
          className={cn(
            "will-change-transform",
            // Springy ease-back on leave; suppressed while actively tracking
            // (the rAF lerp smooths the follow) and under reduced motion.
            "transition-transform duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            "data-[magnetic-active]:transition-none",
            "motion-reduce:transition-none motion-reduce:!transform-none",
          )}
        >
          {children}
        </div>
      </div>
    );
  },
);
Magnetic.displayName = "Magnetic";
