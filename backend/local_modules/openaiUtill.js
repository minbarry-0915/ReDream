import OpenAI from 'openai';
import dotenv from 'dotenv';
import axios from 'axios';
import slugify from 'slugify';
import {uploadS3} from './s3Utill.js';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateStory(title, genre, keyword, description) {
  return await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      {role: 'system', content: 'You are a helpful story writer'},
      {
        role: 'user',
        content: `한국어로 동화를 만들어줘. 동화의 제목은 ${title}이고, 장르는 ${genre}야. 메인 키워드는 ${keyword}이고, 추가로 ${description}이 있어. 이 정보들을 바탕으로 약 400자 정도의 동화를 생성해줘. **중요:** OpenAI의 이미지 생성 정책에 위반되지 않도록 주의해주고, 폭력적이거나, 성적인 내용은 들어가지 않도록 주의해줘. 제목은 포함하지 말고 동화의 내용만 반환하며, 동화의 문단을 명확하게 구별해줘.`,
      },
    ],
    max_tokens: 1000,
  });
}

export async function regenerateText(text) {
  try {
    const gptResponse = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that helps rewrite text to avoid any inappropriate or sensitive content. Please ensure that the text is appropriate for a general audience and avoids any sensitive or policy-violating topics.',
        },
        {
          role: 'user',
          content: `Rewrite the following text to make it suitable for a general audience, avoiding any inappropriate or sensitive content:\n\n"${text}"`,
        },
      ],
      max_tokens: 1000,
    });

    // 응답 데이터 로깅
    console.log('API 응답:', gptResponse);

    // 응답 구조 확인 및 처리
    if (
      gptResponse &&
      gptResponse.data &&
      gptResponse.data.choices &&
      gptResponse.data.choices.length > 0
    ) {
      return gptResponse.data.choices[0].message.content.trim();
    } else {
      throw new Error(
        'API 응답이 예상과 다릅니다. choices 배열이 비어있거나 존재하지 않습니다.',
      );
    }
  } catch (error) {
    console.error('Error regenerating text:', error.message || error);
    throw error;
  }
}

export async function createCoverImage(title) {
  try {
    console.log('Creating Cover Image...');
    const dalleResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `please create a image for book cover, the title is ${title}. **Important**: Do not include any text, speech bubbles, or captions in the image.`,
      size: '1024x1792',
      quality: 'standard',
      n: 1,
    });

    const imagesUrl = dalleResponse.data[0].url;
    const sanitizedTitle = slugify(title, {lower: true, strict: true});
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
    console.log('Creating Paragraph Image...');
    if (containsBannedKeywords(text)) {
      console.log('Banned keyword detected, Regenerate the paragraph...');
      text = await regenerateText(text);
    }

    const dalleResponse = await openai.images.generate({
      model: 'dall-e-3',
      prompt: `Please create an image for a children's story in a 2D animation style. The scene is: ${text}. **Important**: Do not include any text, speech bubbles, or captions in the image.`,
      size: '1024x1792',
      quality: 'standard',
      n: 1,
    });

    const imagesUrl = dalleResponse.data[0].url;
    const sanitizedTitle = slugify(title, {lower: true, strict: true});
    const fileName = `image-${sanitizedTitle}-${Date.now()}.png`;

    const imageBuffer = await downloadImage(imagesUrl);
    const contentType = 'image/png';
    return await uploadS3(imageBuffer, fileName, contentType);
  } catch (error) {
    console.error('Error creating images: ', error);
    return null; // 에러 발생 시 null 반환
  }
}

function containsBannedKeywords(text) {
  const bannedKeywords = [
    '폭력',
    '살인',
    '자살',
    '강간',
    '고문',
    '성적',
    '음란',
    '테러',
    '마약',
    '성매매',
    '폭행',
    '학대',
    '자해',
    '혐오',
    '인종차별',
    '폭발물',
    '범죄',
    '불법',
    '사기',
    '도박',
    '사형',
    '조폭',
    '낙태',
    '자살충동',
    '종교적',
    '불법행위',
    '테러리즘',
    '성폭력',
    '사생활침해',
    '차별',
    '증오발언',
    '과도한 폭력',
    '공포',
    '구타',
    '욕설',
    '모욕',
    '협박',
    '납치',
    '폭력행위',
    '불법마약',
    '불법성매매',
    '종교적 모욕',
    '불법조직',
    '사칭',
    '사기행위',
    '혐오표현',
    '위협',
    '정신적 고통',
    '신체적 상해',
    '악성 행동',
    '사형제',
    '정신적 학대',
    '피해자',
    '성희롱',
    '인종적 모욕',
    '강도',
    '절도',
    '사형수',
    '사이비 종교',
    '의도적 폭력',
    '비도덕적',
    '위협적인',
    '악의적인',
  ];
  return bannedKeywords.some(keyword => text.includes(keyword));
}

async function downloadImage(url) {
  const response = await axios({
    url,
    responseType: 'arraybuffer',
  });
  return response.data;
}
