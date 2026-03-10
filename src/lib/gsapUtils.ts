import { gsap } from "gsap";

/**
 * Animate a numeric value from its current state to a target
 * using GSAP easing. Returns the tween instance for cleanup.
 *
 * @param obj     - An object containing the property to animate
 * @param prop    - The key of the property to animate
 * @param target  - The target numeric value
 * @param options - GSAP tween vars (duration, ease, onUpdate, etc.)
 * @returns       The GSAP tween instance
 *
 * @example
 * ```ts
 * const uniforms = { uHover: { value: 0 } };
 * const tween = animateValue(uniforms.uHover, "value", 1, {
 *   duration: 0.5,
 *   ease: "power2.out",
 * });
 * // Cleanup:
 * tween.kill();
 * ```
 */
export function animateValue<
  T extends Record<string, number>,
  K extends keyof T,
>(
  obj: T,
  prop: K,
  target: number,
  options: gsap.TweenVars = {},
): gsap.core.Tween {
  return gsap.to(obj, {
    [prop]: target,
    duration: 0.6,
    ease: "power2.out",
    ...options,
  });
}

/**
 * Create a GSAP timeline with sane defaults for cinematic sequences.
 * Pauses by default so you can call `.play()` when ready.
 *
 * @param vars - Timeline configuration overrides
 * @returns    A paused GSAP timeline
 *
 * @example
 * ```ts
 * const tl = createTimeline({ onComplete: () => console.log("done") });
 * tl.to(element, { opacity: 1, duration: 1 });
 * tl.play();
 * ```
 */
export function createTimeline(
  vars: gsap.TimelineVars = {},
): gsap.core.Timeline {
  return gsap.timeline({
    paused: true,
    defaults: {
      ease: "power3.inOut",
      duration: 1,
    },
    ...vars,
  });
}

/**
 * Kill all GSAP tweens targeting a specific object.
 * Useful in React cleanup functions.
 *
 * @param target - The animation target to kill tweens for
 */
export function killTweens(target: gsap.TweenTarget): void {
  gsap.killTweensOf(target);
}

/**
 * Wrapper for gsap.context() — creates a scoped GSAP context
 * that can be reverted in a React useEffect cleanup.
 *
 * @param fn    - Function containing GSAP animations to scope
 * @param scope - Optional DOM element or ref to scope selectors to
 * @returns     The GSAP context instance (call `.revert()` on cleanup)
 *
 * @example
 * ```ts
 * useEffect(() => {
 *   const ctx = createGsapContext(() => {
 *     gsap.to(".hero-letter", { y: 0, stagger: 0.05 });
 *   }, containerRef);
 *   return () => ctx.revert();
 * }, []);
 * ```
 */
export function createGsapContext(
  fn: () => void,
  scope?: Element | string | null,
): gsap.Context {
  return gsap.context(fn, scope ?? undefined);
}

/**
 * Lerp (linear interpolation) helper for smooth value transitions
 * inside useFrame loops.
 *
 * @param start   - Current value
 * @param end     - Target value
 * @param factor  - Interpolation factor (0–1), higher = faster
 * @returns       Interpolated value
 */
export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * factor;
}
