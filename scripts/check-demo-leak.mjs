/**
 * Guards FURPS+ C4: a production build must never contain demo accounts or the
 * demo dataset. Run after `npm run build`.
 *
 *   npm run verify:demo-excluded
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const DIST = 'dist'
const FORBIDDEN = [
  'student1234',
  'supervisor1234',
  'admin1234',
  'student@example.com',
  'Aline Uwase',
  'demoData',
]

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
}

let files
try {
  files = walk(DIST)
} catch {
  console.error(`No ${DIST}/ directory. Run "npm run build" first.`)
  process.exit(2)
}

const hits = []

for (const file of files) {
  const contents = readFileSync(file, 'utf8')
  for (const needle of FORBIDDEN) {
    if (contents.includes(needle)) {
      hits.push(`${file}: ${needle}`)
    }
  }
}

if (hits.length > 0) {
  console.error('Demo data leaked into the production bundle:')
  hits.forEach((hit) => console.error(`  - ${hit}`))
  process.exit(1)
}

console.log(`Checked ${files.length} files: no demo accounts or demo dataset in ${DIST}/.`)
