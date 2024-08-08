import express from 'express';
import createBook from '../models/bookModel.js'; // Default import
import createParagraph from '../models/paragraphModel.js'; // Default import
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage'; // 추가
import dotenv from 'dotenv';
import OpenAI from 'openai';
import slugify from 'slugify';

dotenv.config();

const router = express.Router();

// OpenAI 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// AWS Polly 및 S3 클라이언트 설정
const polly = new PollyClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});

// TTS 변환 함수
const convertTextToSpeech = async (text, title) => {
    try {
        //tts 속성 정의
        const params = {
            Text: text,
            OutputFormat: 'mp3',
            VoiceId: 'Seoyeon', // 원하는 음성 선택
        };
        //polly 전송
        const command = new SynthesizeSpeechCommand(params);
        const { AudioStream } = await polly.send(command);

        //제목을 안전하게 변환
        const sanitizedTitle = slugify(title, { lower: true, strict: true }); 
        const fileName = `${sanitizedTitle}-${Date.now()}.mp3`;


        // 오디오 스트림 S3에 업로드
        const upload = new Upload({
            client: s3,
            params: {
                Bucket: process.env.S3_BUCKET_NAME,
                Key: fileName,
                Body: AudioStream,
                ContentType: 'audio/mpeg',
            },
        });

        // 업로드 완료 후 S3 URL 반환
        await upload.done();
        const location = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
        return location;
    } catch (error) {
        console.error('Error converting text to speech:', error);
        throw error;
    }
};

// /createBook 엔드포인트 정의
router.post('/createBook', async (req, res) => {
    const { user_id, title, genre, keyword, description } = req.body;

    try {
        // OpenAI를 통해 동화 생성
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: 'You are a helpful story writer' },
                { role: "user", content: `한국어로 동화를 만들껀데, 동화의 제목은 ${title}이고, 장르는 ${genre}야, 메인키워드는 ${keyword}이고, 추가사항으로는 ${description}이 있어, 이 정보들을 이용해서 400자 정도의 동화를 만들어주는데 결과에 제목은 없이 출력해주고 동화의 문단을 구별해줘` }
            ],
            max_tokens: 1000
        });

        const storyText = gptResponse.choices[0].message.content.trim();
        const paragraphs = storyText.split("\n\n");

        // Book 테이블에 데이터 삽입
        createBook(user_id, title, genre, keyword, description, async (err, book_id) => {
            if (err) return res.status(500).json({ error: 'Failed to create book' });

            const errors = [];

            // TTS 변환 및 저장 함수
            const processParagraphs = async () => {
                for (const paragraph of paragraphs) {
                    try {
                        const audioUrl = await convertTextToSpeech(paragraph, title);
                        // 비동기 작업 수행
                        await new Promise((resolve, reject) => {
                            //db에 문단, 오디오파일 삽입
                            createParagraph(book_id, paragraph, audioUrl, (err) => {
                                if (err) {
                                    errors.push(err);
                                    reject(err);
                                } else {
                                    resolve();
                                }
                            });
                        });
                    } catch (error) {
                        errors.push(error);
                    }
                }

                // 모든 문단 처리가 끝난 후 응답
                if (errors.length) {
                    console.error(errors);
                    return res.status(500).json({ error: 'Failed to create some paragraphs' });
                }
                res.status(201).json({ message: 'Book and paragraphs created successfully' });
            };

            await processParagraphs();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the book' });
    }
});

export default router;
