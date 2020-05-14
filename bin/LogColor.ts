import * as chalk from 'chalk';

/**
 * Abstraction for colored logs.
 */
export default class LogColor {
  /** Method for logging in light blue. */
  public static lightBlue = chalk.hex('#75b0eb');

  /** Method for logging in green. */
  public static green = chalk.green;

  /** Method for logging in yellow. */
  public static yellow = chalk.yellow;

  /** Method for logging in bright yellow. */
  public static brightYellow = chalk.yellowBright;
}
