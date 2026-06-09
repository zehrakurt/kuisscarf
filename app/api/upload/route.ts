import { NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı." }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure the public/images/uploads directory exists
    const uploadDir = path.join(process.cwd(), "public", "images", "uploads")
    await mkdir(uploadDir, { recursive: true })

    // Clean filename to prevent path traversal and ensure safety
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${Date.now()}_${safeName}`
    const filePath = path.join(uploadDir, filename)

    // Write the buffer to the file
    await writeFile(filePath, buffer)

    // Return the relative URL to access the image statically
    const fileUrl = `/images/uploads/${filename}`
    
    console.log(`[Local Upload] File successfully saved to: ${filePath}`)
    return NextResponse.json({ url: fileUrl })
  } catch (error: any) {
    console.error("Local file upload error:", error)
    return NextResponse.json(
      { error: error.message || "Dosya sunucuya kaydedilemedi." },
      { status: 500 }
    )
  }
}
