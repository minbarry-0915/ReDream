import { Upload } from '@aws-sdk/lib-storage';
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import dotenv from 'dotenv'; // 환경 변수 관리

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

export async function uploadS3(buffer, fileName, contentType) {
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: contentType,
        },
    });

    await upload.done();
    return `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
}

export async function deleteFileFromS3(fileUrl) {
    try {
        const filePath = new URL(fileUrl).pathname.substring(1);
        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filePath,
        });

        await s3.send(command);
        console.log(`File ${filePath} deleted successfully from ${process.env.S3_BUCKET_NAME}`);
    } catch (error) {
        if (error.name === 'NoSuchKey') {
            console.log(`File ${filePath} does not exist or already deleted`);
        } else {
            console.error(`Error deleting file ${filePath} from S3:`, error);
            throw error;
        }
    }
}
