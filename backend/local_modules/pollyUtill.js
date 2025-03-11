import {PollyClient, SynthesizeSpeechCommand} from '@aws-sdk/client-polly';
import slugify from 'slugify';
import dotenv from 'dotenv'; // 환경 변수 관리
import {uploadS3} from './s3Utill.js';

dotenv.config();

const polly = new PollyClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function convertTextToSpeech(text, title, index) {
  try {
    console.log('Coverting Text to Speech ', index);
    const params = {
      Text: text,
      OutputFormat: 'mp3',
      VoiceId: 'Seoyeon',
    };

    const command = new SynthesizeSpeechCommand(params);
    const {AudioStream} = await polly.send(command);

    const sanitizedTitle = slugify(title, {lower: true, strict: true});
    const fileName = `tts-${sanitizedTitle}-${index}-${Date.now()}.mp3`;

    const contentType = 'audio/mpeg';
    return await uploadS3(AudioStream, fileName, contentType);
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}
