/**
 * Setup to work together fast-check and jest from the fast-check examples
 *  https://github.com/dubzzz/fast-check/blob/1ceb2b982b754b99aef8d763723206605b67451e/example/jest.setup.js
 */

const fc = require('fast-check');
// Default timeout of 60s
const JestTimeoutMs = 60000;
const FcTimeoutMs = Math.floor(0.8 * JestTimeoutMs);

const verbose =
  process.env.DEBUG === undefined
    ? fc.VerbosityLevel.None
    : process.env.DEBUG !== '*'
    ? fc.VerbosityLevel.Verbose
    : fc.VerbosityLevel.VeryVerbose;

jest.setTimeout(JestTimeoutMs);
fc.configureGlobal({
  interruptAfterTimeLimit: FcTimeoutMs,
  markInterruptAsFailure: true,
  verbose: verbose,
});
