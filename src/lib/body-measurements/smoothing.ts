/**
 * Represents an Exponential Moving Average (EMA) filter.
 * EMA reduces jitter in a stream of numbers while maintaining responsiveness.
 */
export class EmaFilter {
  private alpha: number;
  private value: number | null = null;

  /**
   * @param alpha A smoothing factor between 0 and 1.
   * Lower values (e.g., 0.1) mean higher smoothing (slower response).
   * Higher values (e.g., 0.8) mean lower smoothing (faster response).
   */
  constructor(alpha: number = 0.1) {
    this.alpha = Math.max(0, Math.min(1, alpha));
  }

  /**
   * Add a new raw measurement to the filter.
   */
  public update(newValue: number): number {
    if (this.value === null) {
      this.value = newValue; // Initialize immediately to the first value
    } else {
      this.value = this.alpha * newValue + (1 - this.alpha) * this.value;
    }
    return this.value;
  }

  /**
   * Reset the filter (e.g. if tracking is lost completely).
   */
  public reset(): void {
    this.value = null;
  }

  /**
   * Get the current smoothed value.
   */
  public get(): number | null {
    return this.value;
  }
}
