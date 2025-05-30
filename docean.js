
// Name: Ronald Kiefer
// Date: May 27, 2025 Tuesday 12:10 PM
// Description: This file contains the configuration for the DigitalOcean Spaces client.



import { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import 'dotenv/config';

const spacesEndpoint = process.env.DO_SPACES_ENDPOINT;
const bucket = process.env.DO_SPACES_BUCKET;



export const s3 = new S3Client({
  endpoint: `https://${spacesEndpoint}`,
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
  },
  forcePathStyle: false,
});




// Create or Update video (same logic for S3)
export async function uploadOrUpdateVideo({ buffer, originalname, mimetype }) {
  const params = {
    Bucket: bucket,
    Key: `videos/${originalname}`,
    Body: buffer,
    ACL: 'public-read',
    ContentType: mimetype,
  };
  await s3.send(new PutObjectCommand(params));
  return `https://${bucket}.${spacesEndpoint}/videos/${encodeURIComponent(originalname)}`;
}



// List videos
export async function listVideos() {
  const params = { Bucket: bucket, Prefix: 'videos/' };
  const data = await s3.send(new ListObjectsV2Command(params));
  return (data.Contents || []).map(obj => ({
    key: obj.Key,
    url: `https://${bucket}.${spacesEndpoint}/${obj.Key}`,
  }));
}





// Download video (returns a stream and content type)

export async function downloadVideo(key) {
  const params = { Bucket: bucket, Key: key };
  const data = await s3.send(new GetObjectCommand(params));
  return {
    stream: data.Body, // This is a readable stream
    contentType: data.ContentType || 'application/octet-stream',
    contentLength: data.ContentLength,
    fileName: key.split('/').pop(),
  };
}





// Delete video
export async function deleteVideo(key) {
  const params = { Bucket: bucket, Key: key };
  await s3.send(new DeleteObjectCommand(params));
}


