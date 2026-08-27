import updateSection, {
  parse,
  updateSection as named,
  type LineMatcher,
  type ParseResult
} from '@stackline/update-section'
import historical from '@stackline/update-section/update-section.js'

const starts: LineMatcher = (line) => line === 'START'
const ends: LineMatcher = (line) => line === 'END'
const output: string = updateSection('START\nold\nEND', 'START\nnew\nEND', starts, ends)
const info: ParseResult = parse(output.split('\n'), starts, ends)
const sameType: typeof updateSection = named
const deepType: typeof updateSection = historical

void info
void sameType
void deepType
