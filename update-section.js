'use strict'

function parse (lines, matchesStart, matchesEnd) {
  var startIdx = -1
  var endIdx = -1
  var hasStart = false
  var hasEnd = false
  var line

  for (var index = 0; index < lines.length; index += 1) {
    line = lines[index]

    if (!hasStart) {
      if (matchesStart(line)) {
        startIdx = index
        hasStart = true
      } else {
        // Preserve upstream callback observability while ignoring crossed ends.
        matchesEnd(line)
      }
    } else if (!hasEnd && matchesEnd(line)) {
      endIdx = index
      hasEnd = true
    }

    if (hasStart && hasEnd) break
  }

  // Keep endIdx inclusive. A missing end therefore means the final input line.
  if (!hasEnd) endIdx = lines.length - 1

  return {
    hasStart: hasStart,
    hasEnd: hasEnd,
    startIdx: startIdx,
    endIdx: endIdx
  }
}

function updateSection (content, section, matchesStart, matchesEnd, top) {
  if (!content) return section

  var lines = content.split('\n')
  if (!lines.length) return section

  var info = parse(lines, matchesStart, matchesEnd)

  if (!info.hasStart) {
    return top ? section + '\n\n' + content : content + '\n\n' + section
  }

  var sectionLines = section.split('\n')
  return lines
    .slice(0, info.startIdx)
    .concat(sectionLines, lines.slice(info.endIdx + 1))
    .join('\n')
}

module.exports = updateSection
module.exports.parse = parse
