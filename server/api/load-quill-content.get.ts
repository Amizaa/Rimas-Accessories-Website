import { readFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async () => {
  const filePath = join(process.cwd(), 'server/api/data/quill-content.json')
  const raw = await readFile(filePath, 'utf-8')
  const json = JSON.parse(raw)
  return json
})
