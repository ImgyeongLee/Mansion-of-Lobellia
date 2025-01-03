import { NextRequest, NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '@/lib/db/aws/s3Client';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file provided.' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ message: 'File must be an image.' }, { status: 400 });
        }

        // Convert file to buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Generate unique filename
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.name.replace(/\s/g, '_')}`;

        // Upload to S3
        const command = new PutObjectCommand({
            Bucket: process.env.NEXT_PUBLIC_S3_NAME,
            Key: filename,
            Body: buffer,
            ContentType: file.type,
        });

        await s3Client.send(command);

        const imageUrl = `https://${process.env.NEXT_PUBLIC_S3_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${filename}`;

        // Return the file URL
        return NextResponse.json(
            {
                message: 'File uploaded successfully',
                filename: filename,
                url: imageUrl,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
    }
}
