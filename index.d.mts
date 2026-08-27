export type LineMatcher = (line: string) => boolean

export interface ParseResult {
  hasStart: boolean
  hasEnd: boolean
  startIdx: number
  endIdx: number
}

export declare function parse(
  lines: readonly string[],
  matchesStart: LineMatcher,
  matchesEnd: LineMatcher
): ParseResult

declare function updateSection(
  content: string,
  section: string,
  matchesStart: LineMatcher,
  matchesEnd: LineMatcher,
  top?: boolean
): string

export { updateSection }
export default updateSection
