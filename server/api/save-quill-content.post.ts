import { writeFile } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validate input
  if (!body || !body.content || typeof body.content !== 'string') {
    return { error: 'Invalid content' }
  }

  // Create a JSON object
  const data = {
    savedAt: new Date().toISOString(),
    content: body.content,
    delta: body.delta
  }

  // Define file path
  const filePath = join(process.cwd(), 'server/api/data/quill-content.json')

  // Write to file
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')

  return { success: true, message: 'Content saved to JSON file.' }
})
