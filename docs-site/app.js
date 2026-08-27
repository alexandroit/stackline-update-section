/* global document, navigator */

import updateSection from './update-section-browser.js'

const defaults = {
  content: '# Project\n\n<!-- START generated -->\nold content\n<!-- END generated -->\n\nKeep this paragraph.',
  section: '<!-- START generated -->\nnew content\n<!-- END generated -->',
  start: '<!-- START generated -->',
  end: '<!-- END generated -->',
  placement: 'append'
}

const content = document.querySelector('#original-content')
const section = document.querySelector('#replacement-section')
const startMarker = document.querySelector('#start-marker')
const endMarker = document.querySelector('#end-marker')
const placement = document.querySelector('#placement')
const updatedOutput = document.querySelector('#updated-output')
const parseOutput = document.querySelector('#parse-output')
const matcherDetail = document.querySelector('#matcher-detail')
const title = document.querySelector('#result-title')
const detail = document.querySelector('#result-detail')
const indicator = document.querySelector('#status-indicator')

document.querySelector('#replace-button').addEventListener('click', evaluate)
document.querySelector('#reset-button').addEventListener('click', () => {
  content.value = defaults.content
  section.value = defaults.section
  startMarker.value = defaults.start
  endMarker.value = defaults.end
  placement.value = defaults.placement
  evaluate()
})

for (const element of [content, section, startMarker, endMarker, placement]) {
  element.addEventListener('input', evaluate)
  element.addEventListener('change', evaluate)
}

for (const button of document.querySelectorAll('[data-copy]')) {
  button.addEventListener('click', async () => {
    const target = document.querySelector(button.dataset.copy)
    const value = target ? target.textContent : ''
    await navigator.clipboard.writeText(value)
    const previous = button.textContent
    button.textContent = 'Copied'
    setTimeout(() => { button.textContent = previous }, 1200)
  })
}

function evaluate () {
  try {
    const source = content.value
    const replacement = section.value
    const top = placement.value === 'top'
    const output = updateSection(
      source,
      replacement,
      (line) => line.includes(startMarker.value),
      (line) => line.includes(endMarker.value),
      top
    )

    updatedOutput.textContent = String(output)

    if (!source) {
      parseOutput.textContent = 'null'
      matcherDetail.textContent = 'Updater short-circuited before matching'
      show(true, 'Falsey-content path', 'The real package returned the replacement section without invoking marker callbacks.')
      return
    }

    let startCalls = 0
    let endCalls = 0
    const info = updateSection.parse(
      source.split('\n'),
      (line) => {
        startCalls += 1
        return line.includes(startMarker.value)
      },
      (line) => {
        endCalls += 1
        return line.includes(endMarker.value)
      }
    )
    parseOutput.textContent = JSON.stringify(info, null, 2)
    matcherDetail.textContent = `${startCalls} start calls · ${endCalls} end calls`

    if (info.hasStart && info.hasEnd) {
      show(true, 'Marked range replaced', `Inclusive input lines ${info.startIdx} through ${info.endIdx} were replaced.`)
    } else if (info.hasStart) {
      show(true, 'Open section replaced through EOF', `No end matched; replacement began at inclusive line ${info.startIdx}.`)
    } else {
      show(true, top ? 'Section prepended' : 'Section appended', 'No start marker matched, so the selected insertion policy applied.')
    }
  } catch (error) {
    indicator.classList.add('error')
    title.textContent = 'Package call threw'
    detail.textContent = error && error.message ? error.message : String(error)
    updatedOutput.textContent = 'No output returned.'
    parseOutput.textContent = 'No metadata returned.'
    matcherDetail.textContent = 'Synchronous error preserved'
  }
}

function show (valid, heading, message) {
  indicator.classList.toggle('error', !valid)
  title.textContent = heading
  detail.textContent = message
}

evaluate()
