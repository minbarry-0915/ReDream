import { useState } from 'react';
import axios from 'axios';

function useDeleteBook(){

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const deleteBook = async (bookId: number) => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Deleting the book... :', bookId);
            await axios.delete(`http://192.168.56.1:3000/api/book`, {
                params: {
                book_id: bookId, // 쿼리 파라미터로 book_id 전달
            },
        });
        } catch (err) {
            setError('Failed to delete book');
        } finally {
            setLoading(false);
        }
  };

  return { deleteBook, loading, error };
};

export default useDeleteBook;
