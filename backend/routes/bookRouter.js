import express from 'express';
import createBook from '../models/bookModel.js'; // Default import
import createParagraph from '../models/paragraphModel.js'; // Default import
import { OpenAI } from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// OpenAI 설정
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// TTS 변환 함수 수정 필요
const convertTextToSpeech = async (text) => {
    try {
        const ttsResponse = await openai.audio.speech.create({
            model: 'text-to-speech',
            input: {
                text: text,
            },
            voice: 'alloy', // 원하는 음성
            response_format: 'mp3', // 파일 포맷을 mp3로 설정
        });
        return ttsResponse.url; // TTS 결과 URL 반환
    } catch (error) {
        console.error('Error converting text to speech:', error);
        throw error;
    }
}

// /createBook 엔드포인트 정의
router.post('/createBook', async (req, res) => {
    const { user_id, title, genre, keyword, description } = req.body;

    // OpenAI를 통해 동화 생성
    try {
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4", // 사용할 모델명을 확인하여 설정
            messages: [
                {role: "system", content: 'You are a helpful story writer'},
                {role: "user", content: `한국어로 동화를 만들껀데, 동화의 제목은 ${title}이고, 장르는 ${genre}야, 메인키워드는 ${keyword}이고,
                추가사항으로는 ${description}이 있어, 이 정보들을 이용해서 400자 정도의 동화를 만들어주는데 결과에 제목은 없이 출력해주고 동화의 문단을 구별해줘`}
            ],
            max_tokens: 1000
        });

        const storyText = gptResponse.choices[0].message.content.trim();

        // Book 테이블에 데이터 삽입
        createBook(user_id, title, genre, keyword, description, async (err, book_id) => {
            if (err) return res.status(500).json({ error: 'Failed to create book' });

            const paragraphs = storyText.split("\n\n");
            const errors = [];

            // TTS 변환 및 저장 함수
            const processParagraphs = async () => {
                for (const paragraph of paragraphs) {
                    try {
                        const audioUrl = await convertTextToSpeech(paragraph);
                        //비동기 작업 수행
                        await new Promise((resolve, reject) => {
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
