import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import slugify from 'slugify';
import { uploadS3 } from './s3Utill.js';
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStory(title, genre, keyword, description) {
    return await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
            { role: "system", content: 'You are a helpful story writer' },
            { role: "user", content: `한국어로 동화를 만들어줘. 동화의 제목은 ${title}이고, 장르는 ${genre}야. 메인 키워드는 ${keyword}이고, 추가로 ${description}이 있어. 이 정보들을 바탕으로 약 400자 정도의 동화를 생성해줘. **중요:** OpenAI의 이미지 생성 정책에 위반되지 않도록 주의해줘. 제목은 포함하지 말고 동화의 내용만 반환하며, 동화의 문단을 명확하게 구별해줘.` }
        ],
        max_tokens: 1000
    });
}

export async function regenerateText(text) {
    try {
        const gptResponse = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: 'You are an assistant that helps rewrite text to avoid any inappropriate or sensitive content. Please ensure that the text is appropriate for a general audience and avoids any sensitive or policy-violating topics.' },
                { role: "user", content: `Rewrite the following text to make it suitable for a general audience, avoiding any inappropriate or sensitive content:\n\n"${text}"` }
            ],
            max_tokens: 1000
        });

        return gptResponse.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error regenerating text:', error);
        throw error;
    }
}

export async function createCoverImage(title) {
    try {
        const dalleResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `please create a image for book cover, the title is ${title}. **Important**: Do not include any text, speech bubbles, or captions in the image.`,
            size: "1024x1792",
            quality: "standard",
            n: 1
        });

        const imagesUrl = dalleResponse.data[0].url;
        const sanitizedTitle = slugify(title, { lower: true, strict: true });
        const fileName = `coverImage-${sanitizedTitle}-${Date.now()}.png`;

        const imageBuffer = await downloadImage(imagesUrl);
        const contentType = 'image/png';
        return await uploadS3(imageBuffer, fileName, contentType);
    } catch (error) {
        console.error('Error creating images: ', error);
        throw error;
    }
}

export async function createImages(text, title) {
    try {
        if (containsBannedKeywords(text)) {
            text = await regenerateText(text);
        }

        const dalleResponse = await openai.images.generate({
            model: "dall-e-3",
            prompt: `Please create an image for a children's story in a 2D animation style. The scene is: ${text}. **Important**: Do not include any text, speech bubbles, or captions in the image.`,
            size: "1024x1792",
            quality: "standard",
            n: 1
        });

        const imagesUrl = dalleResponse.data[0].url;
        const sanitizedTitle = slugify(title, { lower: true, strict: true });
        const fileName = `image-${sanitizedTitle}-${Date.now()}.png`;

        const imageBuffer = await downloadImage(imagesUrl);
        const contentType = 'image/png';
        return await uploadS3(imageBuffer, fileName, contentType);
    } catch (error) {
        console.error('Error creating images: ', error);
        throw error;
    }
}

function containsBannedKeywords(text) {
    const bannedKeywords = [
        "폭력", "피", "죽음", "살인", "학대", "고문", "강간", "폭행",
        "자살", "성적", "음란", "혐오", "증오", "테러", "인종차별", "마약",
        "범죄", "패륜", "자해", "비속어"
    ];
    return bannedKeywords.some(keyword => text.includes(keyword));
}

async function downloadImage(url) {
    const response = await axios({
        url,
        responseType: 'arraybuffer'
    });
    return response.data;
}
