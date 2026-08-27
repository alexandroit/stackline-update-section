declare namespace updateSection {
  type LineMatcher = (line: string) => boolean

  interface ParseResult {
    hasStart: boolean
    hasEnd: boolean
    startIdx: number
    endIdx: number
  }

  function parse(
    lines: readonly string[],
    matchesStart: LineMatcher,
    matchesEnd: LineMatcher
  ): ParseResult
}

declare function updateSection(
  content: string,
  section: string,
  matchesStart: updateSection.LineMatcher,
  matchesEnd: updateSection.LineMatcher,
  top?: boolean
): string

export = updateSection
