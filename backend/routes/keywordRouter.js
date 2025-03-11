import express from 'express';
import Keyword from '../models/keywordModel.js';

const router = express.Router();

router.get('/keywordList', async (req, res) => {
  const {genre_id} = req.query;

  try {
    const keywords = await new Promise((resolve, reject) => {
      Keyword.getKeywordList(genre_id, (err, keywordList) => {
        if (err) {
          console.error('Database query error: ', err);
          reject(err);
        }
        console.log('Query results: ', keywordList);
        resolve(keywordList);
      });
    });

    res.status(200).json({keywords});
  } catch (error) {
    console.error(error);
    res.status(500).json({error: 'Failed to fetch keywords', details: error});
  }
});

export default router;
