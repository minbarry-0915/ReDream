import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useCreateBook } from "../contexts/createBookContext";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { REACT_NATIVE_BACKEND_IP} from '@env';

interface Book{
    book_id: number;
    user_id: string;
    title: string;
    genre: string;
    keyword: string;
    description: string;
    cover_image_path: string;
    create_at: string;
}

interface Paragraph {
    paragraph_id: number;
    book_id: number;
    text: string;
    image_path: string;
    audio_path: string;
}

export interface BookData{
    book: Book,
    paragraphs: Paragraph[],
}



const useGetBook = (bookId: number) =>{
    const [bookData, setBookData] = useState<BookData>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(()=>{
        const fetchData = async()=>{
            try{
                setLoading(true);
                setError(null);

                const response = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}:3000/api/book/${bookId}/full`)
                const {book, paragraphs} = response.data;

                setBookData({book: book[0], paragraphs});
            }catch(error){
                setError(error);
            }finally{
                setLoading(false);
            }
        };

        fetchData();
    },[bookId]);

    return {bookData, loading, error};
}

export default useGetBook;