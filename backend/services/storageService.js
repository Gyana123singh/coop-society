/**
 * Cloud Storage Service (AWS S3 / Cloudinary / Local Fallback)
 */

const uploadPDFToCloud = async (buffer, filename) => {
  // If AWS S3 credentials are set in environment variables:
  if (process.env.AWS_S3_BUCKET && process.env.AWS_ACCESS_KEY_ID) {
    try {
      // Lazy load AWS SDK if installed
      const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
      const s3 = new S3Client({
        region: process.env.AWS_REGION || 'us-east-1',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
        }
      });

      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET,
        Key: `receipts/${filename}`,
        Body: buffer,
        ContentType: 'application/pdf'
      });

      await s3.send(command);
      return `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/receipts/${filename}`;
    } catch (err) {
      console.warn('[Storage Service] S3 upload failed, returning stream/local fallback:', err.message);
    }
  }

  // Fallback to local URL path
  return `/api/v1/receipts/pdf-stream/${filename}`;
};

module.exports = { uploadPDFToCloud };
