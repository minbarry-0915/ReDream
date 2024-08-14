import express from 'express';
import Genre from '../models/genreModel.js';

const router = express.Router();

router.get('/genreList', async(req,res) =>{
    
    try{
        const genres = await new Promise((resolve, reject) =>{
            Genre.getGenreList((err, genreList) =>{
                if(err){
                    console.error('Database query error: ', err);
                    reject(err);
                }
                console.log('Query results: ', genreList);
                resolve(genreList);
            });
        });

        res.status(200).json({genres});
    }catch(error){
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch genres', details: error});
    }
});

export default router;