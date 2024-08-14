import express from 'express'; //server
import Book from '../models/bookModel.js'; // Default import
import Paragraph from '../models/paragraphModel.js'; // Default import
import { PollyClient, SynthesizeSpeechCommand } from '@aws-sdk/client-polly'; //tts
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage'; // 추가
import dotenv from 'dotenv'; //env파일
import OpenAI from 'openai'; //gpt, dalle
import slugify from 'slugify'; //파일명 변환용
import axios from 'axios'; //server
import url from 'url'; //url 추출용
import { create } from 'domain';

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
const convertTextToSpeech = async (text, title, index) => {
    //console.log(text);

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
        const fileName = `tts-${sanitizedTitle}-${index}-${Date.now()}.mp3`;

        const contentType = 'audio/mpeg'
        const awsS3Url = await uploadS3(AudioStream, fileName, contentType);
        return awsS3Url;
    } catch (error) {
        console.error('Error converting text to speech:', error);
        throw error;
    }
};

async function downloadImage(url) {
    const response = await axios({
        url,
        responseType: 'arraybuffer'
    });

    return response.data;
}

//s3 업로드
async function uploadS3(buffer, fileName, contentType){
    const upload = new Upload({
        client: s3,
        params: {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: fileName,
            Body: buffer,
            ContentType: contentType,
        },
    });

    // 업로드 완료 후 S3 URL 반환
    await upload.done();
    const location = `https://${process.env.S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
    return location;
}
const createCoverImage = async (title) => {
    try{
        const dalleResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `please create a image for book cover, the title is ${title}.
            **Important**: Do not include any text, speech bubbles, or captions in the image. `,
            size: "1024x1792",  // 이미지 크기
            quality: "standard",  // 이미지 품질
            n: 1  // 생성할 이미지 수
        });

        const imagesUrl = dalleResponse.data[0].url;

        //제목을 안전하게 변환
        const sanitizedTitle = slugify(title, { lower: true, strict: true }); 
        const fileName = `coverImage-${sanitizedTitle}-${Date.now()}.png`;

        //S3 업로드
        const imageBuffer = await downloadImage(imagesUrl);
        const contentType = 'image/png';
        const awsS3Url = await uploadS3(imageBuffer, fileName, contentType);
        return awsS3Url;
    }catch (error) {
        console.error('Error creating images: ', error);
        throw error;
    }
}
const createImages = async (text, title) =>{
    try {
        const dalleResponse = await openai.images.generate({
            model: "dall-e-3",  // 모델 이름
            prompt: `
            Please create a image for a children's story in 2d animation style. 
            The scene is: ${text}. 
            **Important**: Do not include any text, speech bubbles, or captions in the image. 
            `,  // 이미지 프롬프트
            size: "1024x1792",  // 이미지 크기
            quality: "standard",  // 이미지 품질
            n: 1  // 생성할 이미지 수
        }); 
    
        const imagesUrl = dalleResponse.data[0].url;
        //console.log(images_url);

        //제목을 안전하게 변환
        const sanitizedTitle = slugify(title, { lower: true, strict: true }); 
        const fileName = `image-${sanitizedTitle}-${Date.now()}.png`;
        
        //S3 업로드
        const imageBuffer = await downloadImage(imagesUrl);
        const contentType = 'image/png';
        const awsS3Url = await uploadS3(imageBuffer, fileName, contentType);
        return awsS3Url;
    } catch (error) {
        console.error('Error creating images: ', error);
        throw error;
    }

}
//create 엔드포인트 정의
router.post('/book/create', async (req, res) => {
    const { user_id, title, genre, keyword, description } = req.body;

    try {
        // OpenAI를 통해 동화 생성
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: 'You are a helpful story writer' },
                { role: "user", content: 
                    `한국어로 동화를 만들어줘. 
                    동화의 제목은 ${title}이고, 
                    장르는 ${genre}야. 
                    메인 키워드는 ${keyword}이고, 
                    추가로 ${description}이 있어. 
                    이 정보들을 바탕으로 약 400자 정도의 동화를 생성해줘. 
                    **중요:** OpenAI의 이미지 생성 정책에 위반되지 않도록 주의해줘. 
                    제목은 포함하지 말고, 동화의 문단을 명확하게 구별해줘.` }
            ],
            max_tokens: 1000
        });

        const storyText = gptResponse.choices[0].message.content.trim();
        const paragraphs = storyText.split("\n\n");
        //console.log(paragraphs);

        const coverImage = await createCoverImage(title);

        Book.create(user_id, title, genre, keyword, description, coverImage, async (err, book_id) => {
            if (err) return res.status(500).json({ error: 'Failed to create book' });

            // TTS 변환 및 저장 함수
            try{
                const results = [];

                for (let index = 0; index < paragraphs.length; index++) {
                    const paragraph = paragraphs[index];
                    try {
                        console.log(`Processing paragraph ${index + 1} of ${paragraphs.length}`);
                        const audioUrl = await convertTextToSpeech(paragraph, title, index);
                        const imageUrl = await createImages(paragraph, title);
                        results.push({ paragraph, imageUrl, audioUrl, index });
                        
                        // 각 요청 사이에 짧은 딜레이를 추가하여 API Rate Limit을 피할 수 있습니다.
                        await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 딜레이
                    } catch (error) {
                        console.error(`Error processing paragraph ${index + 1}:`, error);
                        throw error;
                    }
                }


                const sortedResults = results.sort((a,b) => a.index - b.index);

                for(const result of sortedResults){
                    await new Promise((resolve, reject) =>{
                        Paragraph.create(book_id, result.paragraph, result.imageUrl, result.audioUrl, (err) => {
                            if(err)
                                reject(err);
                            else
                                resolve();
                        });
                    });
                };

                res.status(200).json({ message: 'Book and paragraphs created successfully'});

            }catch(error){
                // 모든 에러를 여기서 처리
                console.error('Error processing paragraphs:', error);
                res.status(500).json({ error: 'Failed to process some paragraphs', details: error });
            }

        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the book' });
    }
});

//bookList 조회 엔드포인트 정의
router.get('/bookList', async (req, res) => {
    const { user_id } = req.query;

    try{
        const books = await new Promise((resolve, reject) =>{
            Book.view(user_id, (err, booklist) => {
                if(err){
                    console.error('Database query error:', err); // 에러 로그
                    reject(err);
                }
                else{
                    console.log('Query result:', booklist); // 쿼리 결과 로그
                    resolve(booklist);
                }
            });
        });
        res.status(200).json({books});
    }
    catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books', details: error});
    }
});

async function extractFilePathFromUrl(fileUrl){
    const parsedUrl = new URL(fileUrl);
    //console.log(parsedUrl.pathname.substring(1));
    // parsedUrl.pathname = /path/to/resource
    // substring으로 / 제거
    return parsedUrl.pathname.substring(1);
}

async function deleteFileFromS3(fileUrl){
    try {
        console.log(fileUrl);

        const filePath = await extractFilePathFromUrl(fileUrl);

        if (typeof filePath !== 'string') {
            console.error('Invalid file path:', filePath);
            throw new Error('Invalid file path provided for S3 deletion');
        }


        const command = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: filePath,
        });

        await s3.send(command);
        console.log(`File ${filePath} deleted successfully from ${process.env.S3_BUCKET_NAME}`);
    } catch(error){
        if (error.name === 'NoSuchKey') {
            // 파일이 이미 삭제된 경우
            console.log(`File ${filePath} does not exist or already deleted`);
        } else {
            console.error(`Error deleting file ${filePath} from S3:`, error);
            throw error;
        }
    }
};

//book 정보 조회 엔드포인트 정의
//  /books/3/full
router.get('/book/:book_id/full', async (req, res) => {
    const { book_id } = req.params;
    //console.log('book_id:', book_id);

    if (!book_id) {
        return res.status(400).json({ error: 'Missing book_id parameter' });
    }
    try {
        // 책 정보를 조회
        const bookPromise = new Promise((resolve, reject) => {
            Book.getBookById(book_id, (err, books) => {
                if (err) {
                    return reject(err);
                }
                resolve(books);
            });
        });

        // 문단 정보를 조회
        const paragraphPromise = new Promise((resolve, reject) => {
            Paragraph.getParagraphById(book_id, (err, paragraphs) => {
                if (err) {
                    return reject(err);
                }
                resolve(paragraphs);
            });
        });

        const [book, paragraphs] = await Promise.all([bookPromise, paragraphPromise]);

        //console.log('Book query result:', book);
        //console.log('Paragraph query result:', paragraphs);

        // 책 정보가 없는 경우
        if (book.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        // 문단이 없는 경우
        if (paragraphs.length === 0) {
            return res.status(404).json({ book, error: 'No paragraphs found for the book' });
        }

        // 책과 문단 정보 모두 반환
        res.status(200).json({ book, paragraphs });

    } catch (error) {
        console.error('Error fetching book and paragraphs:', error);
        res.status(500).json({ error: 'Failed to fetch book and paragraphs', details: error });
    }
});

//delete 엔드포인트 정의
router.delete('/book', async (req, res) =>{
    const {book_id} = req.query;

    try{
        //S3에 저장되어있는 관련 파일 경로 추출
        const paths = await new Promise((resolve, reject) =>{
            Paragraph.getParagraphPaths(book_id, (err, res) =>{
                if(err){
                    reject(err);
                } else{
                    resolve(res);
                }
            })
        })
        //해당 동화 관련 파일 삭제
        const deletePromises = paths.map(async (path) => {
            try {
                await deleteFileFromS3(path.audio_path);
            } catch (error) {
                // 에러가 발생한 경우 처리
                console.error(`Failed to delete audio file ${path.audio_path}:`, error);
            }
            if (path.image_path) {
                try {
                    await deleteFileFromS3(path.image_path);
                } catch (error) {
                    // 에러가 발생한 경우 처리
                    console.error(`Failed to delete image file ${path.image_path}:`, error);
                }
            }
        });

        await Promise.all(deletePromises);
        //DB에서 해당 레코드 삭제 
        await new Promise((resolve, reject) =>{
            Book.delete(book_id, (err) =>{
                if(err){
                    reject(err);
                } else{
                    resolve();
                }
            });
        });

        res.status(200).json({message: 'Book and related Paragraphs deleted successfully'});
    }catch(error){
        console.error('Error:', error);
        res.status(500).json({error: 'Failed to delete book', details: error});
    }
})


export default router;
