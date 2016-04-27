/**
 * Normalizes provided URLs by removing slashes from start and finish.
 */
export function stripSlashes(location) {
  return location.replace(/^(\/*)|(\/*)$/g, '');
}
