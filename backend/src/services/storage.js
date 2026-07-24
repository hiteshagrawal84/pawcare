const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');
const Media = require('../models/Media');

let s3Client = null;

const getS3 = () => {
  if (s3Client) return s3Client;
  if (!process.env.S3_ACCESS_KEY || !process.env.S3_SECRET_KEY) return null;

  s3Client = new S3Client({
    region: process.env.S3_REGION || 'us-east-1',
    endpoint: process.env.S3_ENDPOINT || undefined,
    forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_KEY,
    },
  });
  return s3Client;
};

const getFileType = (mimeType) => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType === 'application/pdf') return 'document';
  return 'other';
};

const uploadToS3 = async (file, folder = 'general') => {
  const client = getS3();
  const ext = path.extname(file.originalname);
  const filename = `${uuidv4()}${ext}`;
  const key = `${folder}/${filename}`;
  const bucket = process.env.S3_BUCKET || 'pawcare';

  if (client) {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      })
    );

    const publicUrl = process.env.S3_PUBLIC_URL || process.env.S3_ENDPOINT;
    const url = `${publicUrl}/${bucket}/${key}`;
    return { filename, key, url };
  }

  // Local fallback
  const uploadDir = path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads', folder);
  fs.mkdirSync(uploadDir, { recursive: true });
  const localPath = path.join(uploadDir, filename);
  fs.writeFileSync(localPath, file.buffer);
  const url = `/uploads/${folder}/${filename}`;
  return { filename, key: `${folder}/${filename}`, url };
};

const deleteFromS3 = async (key) => {
  const client = getS3();
  if (client && key) {
    try {
      await client.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET || 'pawcare',
          Key: key,
        })
      );
    } catch (err) {
      console.warn('S3 delete failed:', err.message);
    }
  }
};

const saveMedia = async (file, userId, folder = 'general', alt = '') => {
  const { filename, key, url } = await uploadToS3(file, folder);
  return Media.create({
    filename,
    originalName: file.originalname,
    url,
    key,
    mimeType: file.mimetype,
    size: file.size,
    type: getFileType(file.mimetype),
    folder,
    alt,
    uploadedBy: userId,
  });
};

module.exports = { uploadToS3, deleteFromS3, saveMedia, getS3 };
