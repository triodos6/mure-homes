import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
    }

    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Cloud storage is not configured.' }, { status: 500 });
    }

    const data = await request.formData();
    const file = data.get('file');
    const folder = data.get('folder') || 'general';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > 10 * 1024 * 1024) return NextResponse.json({ error: 'File too large. Maximum 10MB allowed.' }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const resource_type = file.type?.startsWith('image/') ? 'image' : 'auto';

    const result = await uploadToCloudinary(buffer, { folder: `murahomes/${folder}`, resource_type });

    return NextResponse.json({
      url: result.secure_url || result.url,
      publicId: result.public_id,
      width: result.width || null,
      height: result.height || null,
    });
  } catch (error) {
    console.error('Cloudinary upload failed:', error);
    return NextResponse.json({ error: `Upload failed: ${error.message || 'Unknown error'}` }, { status: 500 });
  }
}
