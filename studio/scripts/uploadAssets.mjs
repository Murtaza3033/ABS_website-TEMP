#!/usr/bin/env node
/**
 * Asset upload pass — replaces the temporary `*Path` placeholder strings
 * (logoPath / photoPath / illustrationPath / coverImagePath / galleryPaths)
 * seeded in Phase 2 with real Sanity image assets, on the matching typed
 * `image` field the schema already has.
 *
 * Safe & idempotent:
 *  - Never touches a document that has no path field, or whose real image
 *    field is already populated (checked by fetching fresh, non-CDN data).
 *  - Never removes/overwrites the `*Path` fields — they stay as-is.
 *  - Never invents a file: if the resolved local path doesn't exist on disk,
 *    the document is left untouched and the miss is logged.
 *  - Uploads each unique local file at most once per run, even if multiple
 *    fields/documents reference the same path (e.g. this event's
 *    coverImagePath and gallery[0] are the same file).
 *
 * ---------------------------------------------------------------------------
 * USAGE
 * ---------------------------------------------------------------------------
 *   npm run upload-assets:dry-run   # preview only — no uploads, no patches,
 *                                    # no token required
 *   npm run upload-assets           # uploads + patches for real — requires
 *                                    # SANITY_WRITE_TOKEN in studio/.env
 *                                    # (see studio/scripts/seed.mjs header for
 *                                    # how to create one)
 */

import {config as loadEnv} from 'dotenv'
import {fileURLToPath} from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import {randomUUID} from 'node:crypto'
import {createClient} from '@sanity/client'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const STUDIO_DIR = path.join(__dirname, '..')
const PROJECT_ROOT = path.join(STUDIO_DIR, '..')
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'public')

loadEnv({path: path.join(STUDIO_DIR, '.env')})

const DRY_RUN = process.argv.includes('--dry-run')

const projectId = process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_WRITE_TOKEN

if (!projectId) {
  throw new Error('Missing SANITY_STUDIO_PROJECT_ID in studio/.env')
}
if (!DRY_RUN && !token) {
  throw new Error(
    'Missing SANITY_WRITE_TOKEN in studio/.env. See the header comment in ' +
      'studio/scripts/seed.mjs for how to create one, or run with --dry-run ' +
      'to preview without a token.',
  )
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false, // always read fresh — about to check/patch current state
})

// ---------------------------------------------------------------------------
// Which *Path field feeds which real `image` field, per document type.
// Field names are the schema's actual names (studio/schemaTypes/documents/*),
// not the generic names in the task brief — e.g. teamMember's image field is
// `photo`, not `image`; industry's is `illustration`, not `image`.
// ---------------------------------------------------------------------------
const FIELD_MAP = [
  {type: 'siteSettings', fields: {logoPath: {field: 'logo', kind: 'single'}}},
  {type: 'client', fields: {logoPath: {field: 'logo', kind: 'single'}}},
  {type: 'teamMember', fields: {photoPath: {field: 'photo', kind: 'single'}}},
  {type: 'industry', fields: {illustrationPath: {field: 'illustration', kind: 'single'}}},
  {
    type: 'event',
    fields: {
      coverImagePath: {field: 'coverImage', kind: 'single'},
      galleryPaths: {field: 'gallery', kind: 'array'},
    },
  },
  {type: 'product', fields: {logoPath: {field: 'logo', kind: 'single'}}},
]

// product-pharmafieldflo's logoPath is actually an About-page dashboard
// screenshot (dash-pharmafieldflo.png), not a real product logo — skip this
// one patch until a proper logo asset exists, per explicit instruction.
const SKIP_PATCHES = new Set(['product-pharmafieldflo:logo'])

function resolveLocalPath(publicPath) {
  return path.join(PUBLIC_DIR, publicPath.replace(/^\/+/, ''))
}

function isSingleImagePopulated(value) {
  return Boolean(value && value.asset)
}

function isArrayImagePopulated(value) {
  return Array.isArray(value) && value.length > 0 && value.every((v) => v && v.asset)
}

async function buildPlan() {
  const stats = {
    docsScanned: 0,
    docsUnchanged: 0,
    pathsFound: 0,
    filesExist: 0,
    filesMissing: 0,
    alreadyPopulated: 0,
  }
  const missing = []
  const skippedPopulated = []
  const skippedManual = []
  const patchPlan = [] // {docId, type, field, kind, paths}

  for (const {type, fields} of FIELD_MAP) {
    const docs = await client.fetch(`*[_type == $type]`, {type})
    for (const doc of docs) {
      stats.docsScanned++
      let docHasPlannedPatch = false

      for (const [pathField, cfg] of Object.entries(fields)) {
        const rawValue = doc[pathField]
        if (!rawValue) continue // no path on this doc — leave unchanged, per instructions

        if (SKIP_PATCHES.has(`${doc._id}:${cfg.field}`)) {
          skippedManual.push({doc: doc._id, field: cfg.field, path: rawValue})
          continue
        }

        if (cfg.kind === 'single') {
          stats.pathsFound++
          if (isSingleImagePopulated(doc[cfg.field])) {
            stats.alreadyPopulated++
            skippedPopulated.push({doc: doc._id, field: cfg.field})
            continue
          }
          const abs = resolveLocalPath(rawValue)
          if (!fs.existsSync(abs)) {
            stats.filesMissing++
            missing.push({doc: doc._id, field: cfg.field, path: rawValue})
            continue
          }
          stats.filesExist++
          docHasPlannedPatch = true
          patchPlan.push({docId: doc._id, type, field: cfg.field, kind: 'single', paths: [rawValue]})
        } else {
          // array field (event.gallery)
          const arr = Array.isArray(rawValue) ? rawValue : []
          stats.pathsFound += arr.length
          if (isArrayImagePopulated(doc[cfg.field])) {
            stats.alreadyPopulated += arr.length
            skippedPopulated.push({doc: doc._id, field: cfg.field})
            continue
          }
          const resolved = []
          for (const p of arr) {
            const abs = resolveLocalPath(p)
            if (!fs.existsSync(abs)) {
              stats.filesMissing++
              missing.push({doc: doc._id, field: cfg.field, path: p})
              continue
            }
            stats.filesExist++
            resolved.push(p)
          }
          if (resolved.length > 0) {
            docHasPlannedPatch = true
            patchPlan.push({docId: doc._id, type, field: cfg.field, kind: 'array', paths: resolved})
          }
        }
      }

      if (!docHasPlannedPatch) stats.docsUnchanged++
    }
  }

  return {stats, missing, skippedPopulated, skippedManual, patchPlan}
}

function printReport({stats, missing, skippedPopulated, skippedManual, patchPlan}) {
  const uniqueFiles = new Set()
  let totalRefs = 0
  for (const item of patchPlan) {
    for (const p of item.paths) {
      uniqueFiles.add(resolveLocalPath(p))
      totalRefs++
    }
  }

  console.log(`${DRY_RUN ? '[dry run] ' : ''}Asset upload plan`)
  console.log(`  documents scanned:        ${stats.docsScanned}`)
  console.log(`  documents left unchanged: ${stats.docsUnchanged} (no path field, or nothing left to patch)`)
  console.log(`  path values found:        ${stats.pathsFound}`)
  console.log(`  -> files exist on disk:   ${stats.filesExist}`)
  console.log(`  -> files missing:         ${stats.filesMissing}`)
  console.log(`  -> already populated:     ${stats.alreadyPopulated} (skipped, no re-upload)`)
  console.log(`  unique files to upload:   ${uniqueFiles.size} (covering ${totalRefs} field references — duplicates reused)`)

  console.log(`\nFields that will be patched (${patchPlan.length} operations):`)
  for (const item of patchPlan) {
    console.log(`  ${item.type.padEnd(12)} ${item.docId.padEnd(38)} -> ${item.field} [${item.kind}] (${item.paths.length} file${item.paths.length > 1 ? 's' : ''})`)
  }

  if (skippedPopulated.length) {
    console.log(`\nAlready populated — skipped (${skippedPopulated.length}):`)
    for (const s of skippedPopulated) console.log(`  ${s.doc} -> ${s.field}`)
  }

  if (skippedManual.length) {
    console.log(`\nManually excluded — skipped (${skippedManual.length}):`)
    for (const s of skippedManual) console.log(`  ${s.doc} -> ${s.field} (${s.path}) — not a real logo, left unpatched`)
  }

  if (missing.length) {
    console.log(`\nMissing local files — left unchanged (${missing.length}):`)
    for (const m of missing) console.log(`  ${m.doc} -> ${m.field}: ${m.path}`)
  } else {
    console.log('\nNo missing local files.')
  }
}

async function runUploads(plan) {
  const uploadedByAbsPath = new Map() // in-run dedupe: same file used more than once
  let uploadCount = 0
  let patchCount = 0

  for (const item of plan.patchPlan) {
    const assetIds = []
    for (const p of item.paths) {
      const abs = resolveLocalPath(p)
      let assetId = uploadedByAbsPath.get(abs)
      if (!assetId) {
        const buffer = fs.readFileSync(abs)
        const asset = await client.assets.upload('image', buffer, {filename: path.basename(abs)})
        assetId = asset._id
        uploadedByAbsPath.set(abs, assetId)
        uploadCount++
        console.log(`  uploaded ${p} -> ${assetId}`)
      }
      assetIds.push(assetId)
    }

    const value =
      item.kind === 'single'
        ? {_type: 'image', asset: {_type: 'reference', _ref: assetIds[0]}}
        : assetIds.map((id) => ({_type: 'image', _key: randomUUID(), asset: {_type: 'reference', _ref: id}}))

    await client.patch(item.docId).set({[item.field]: value}).commit()
    patchCount++
    console.log(`  patched ${item.docId}.${item.field}`)
  }

  console.log(`\nDone. ${uploadCount} unique files uploaded, ${patchCount} documents patched.`)
}

async function main() {
  const plan = await buildPlan()
  printReport(plan)

  if (DRY_RUN) {
    console.log('\nDry run complete — nothing was uploaded or written to Sanity.')
    return
  }

  console.log('\nUploading and patching...')
  await runUploads(plan)
}

main().catch((err) => {
  console.error('\nAsset upload failed:')
  console.error(err.message || err)
  process.exit(1)
})
