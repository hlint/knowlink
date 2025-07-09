import { z } from "zod";

/**
 * Converts angle in degrees to radians.
 * @param degrees - Angle in degrees.
 * @returns Angle in radians.
 */
export function degreesToRadians(degrees: number) {
  return (degrees / 180.0) * Math.PI;
}

/**
 * Converts angle in radians to degrees.
 * @param radians - Angle in radians.
 * @returns Angle in degrees.
 */
export function radiansToDegrees(radians: number) {
  return (radians * 180.0) / Math.PI;
}

/**
 * Calculates the non-linear gain from an array of gains.
 * @param gains - Array of gain values between 0 and 1.
 * @returns Non-linear gain.
 */
export function calculateNonLinearGain(gains: number[]) {
  z.array(z.number().min(0).max(1)).parse(gains);
  return 1 - gains.map((t) => 1 - t).reduceRight((a, b) => a * b);
}
