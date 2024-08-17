import express from 'express';
import Book from '../models/bookModel.js';
import Paragraph from '../models/paragraphModel.js';
import { convertTextToSpeech } from '../local_modules/pollyUtill.js';
import { createCoverImage, createImages, generateStory } from '../local_modules/openaiUtill.js';
import { deleteFileFromS3 } from '../local_modules/s3Utill.js';

const router = express.Router();

router.post('/book/create', async (req, res) => {
    const { user_id, title, genre, keyword, description } = req.body;

    try {
        const gptResponse = await generateStory(title, genre, keyword, description);
        const storyText = gptResponse.choices[0].message.content.trim();
        const paragraphs = storyText.split("\n\n");
        
        const coverImage = await createCoverImage(title);

        Book.create(user_id, title, genre, keyword, description, coverImage, async (err, book_id) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to create book', details: err });
            }

            try {
                const results = [];

                for (let index = 0; index < paragraphs.length; index++) {
                    const paragraph = paragraphs[index];
                    try {
                        console.log(`Processing paragraph ${index + 1} of ${paragraphs.length}`);
                        const audioUrl = await convertTextToSpeech(paragraph, title, index);
                        const imageUrl = await createImages(paragraph, title);

                        results.push({ paragraph, imageUrl, audioUrl, index });

                        await new Promise(resolve => setTimeout(resolve, 10000)); // 10초 딜레이
                    } catch (error) {
                        console.error(`Error processing paragraph ${index + 1}:`, error);
                        throw error;
                    }
                }

                const sortedResults = results.sort((a, b) => a.index - b.index);

                for (const result of sortedResults) {
                    await new Promise((resolve, reject) => {
                        Paragraph.create(book_id, result.paragraph, result.imageUrl, result.audioUrl, (err) => {
                            if (err) reject(err);
                            else resolve();
                        });
                    });
                }

                res.status(200).json({ message: 'Book and paragraphs created successfully' });
            } catch (error) {
                console.error('Error processing paragraphs:', error);
                res.status(500).json({ error: 'Failed to process some paragraphs', details: error });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating the book' });
    }
});

router.get('/bookList', async (req, res) => {
    const { user_id } = req.query;

    try {
        const books = await new Promise((resolve, reject) => {
            Book.view(user_id, (err, booklist) => {
                if (err) {
                    console.error('Database query error:', err);
                    reject(err);
                } else {
                    console.log('Query result:', booklist);
                    resolve(booklist);
                }
            });
        });
        res.status(200).json({ books });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch books', details: error });
    }
});

router.get('/book/:book_id/full', async (req, res) => {
    const { book_id } = req.params;

    if (!book_id) {
        return res.status(400).json({ error: 'Missing book_id parameter' });
    }
    try {
        const bookPromise = new Promise((resolve, reject) => {
            Book.getBookById(book_id, (err, books) => {
                if (err) {
                    return reject(err);
                }
                resolve(books);
            });
        });

        const paragraphPromise = new Promise((resolve, reject) => {
            Paragraph.getParagraphById(book_id, (err, paragraphs) => {
                if (err) {
                    return reject(err);
                }
                resolve(paragraphs);
            });
        });

        const [book, paragraphs] = await Promise.all([bookPromise, paragraphPromise]);

        if (book.length === 0) {
            return res.status(404).json({ error: 'Book not found' });
        }

        if (paragraphs.length === 0) {
            return res.status(404).json({ book, error: 'No paragraphs found for the book' });
        }

        res.status(200).json({ book, paragraphs });

    } catch (error) {
        console.error('Error fetching book and paragraphs:', error);
        res.status(500).json({ error: 'Failed to fetch book and paragraphs', details: error });
    }
});

router.delete('/book', async (req, res) => {
    const { book_id } = req.query;

    try {
        const paths = await new Promise((resolve, reject) => {
            Paragraph.getParagraphPaths(book_id, (err, res) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            });
        });

        const deletePromises = paths.map(async (path) => {
            try {
                await deleteFileFromS3(path.audio_path);
            } catch (error) {
                console.error(`Failed to delete audio file ${path.audio_path}:`, error);
            }
            if (path.image_path) {
                try {
                    await deleteFileFromS3(path.image_path);
                } catch (error) {
                    console.error(`Failed to delete image file ${path.image_path}:`, error);
                }
            }
        });

        await Promise.all(deletePromises);

        await new Promise((resolve, reject) => {
            Book.delete(book_id, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });

        res.status(200).json({ message: 'Book and related Paragraphs deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to delete book', details: error });
    }
});

export default router;
