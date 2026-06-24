/**
 * Async feature bundle for the `/create` hover-lift springs.
 *
 * `LiftCard` / `LiftTile` load this through `LazyMotion`'s async `features`
 * prop, which code-splits the `domAnimation` feature set (DOM animation only —
 * no layout/drag) into its own chunk so it stays OUT of `/create`'s first-load
 * JS. Only the tiny `m` component ships up front; the animation features load
 * right after hydration (a hover that fires in the first frame just settles
 * instantly — fine for a micro-interaction). Keeps the route within budget.
 */
export { domAnimation as default } from "motion/react";
