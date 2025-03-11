import {useEffect, useState} from 'react';
import axios from 'axios';
import {useSelector} from 'react-redux';
import {RootState} from '../redux/store'; // Redux store의 RootState 타입 임포트
import {REACT_NATIVE_BACKEND_IP} from '@env';

// Define BookProp interface
export interface BookProp {
  bookId: number;
  title: string;
  genre: string;
  createAt: string;
  bookCoverUri: string;
}

const useFetchBookList = (refreshFlag: boolean) => {
  const [booklist, setBookList] = useState<BookProp[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?.id);

  useEffect(() => {
    const fetchBookList = async () => {
      if (!userId) {
        return;
      }

      try {
        const response = await axios.get(
          `http://${REACT_NATIVE_BACKEND_IP}:3000/api/bookList`,
          {
            params: {user_id: userId},
          },
        );

        if (response.data && Array.isArray(response.data.books)) {
          const books: BookProp[] = response.data.books.map((item: any) => ({
            bookId: item.book_id,
            title: item.title,
            genre: item.genre,
            createAt: new Date(item.create_at).toISOString().split('T')[0],
            bookCoverUri: item.cover_image_path,
          }));
          setBookList(books);
        } else {
          console.error('Response data.books is not an array:', response.data);
        }
      } catch (error) {
        console.error('Error fetching book list:', error);
      }
    };

    fetchBookList();
  }, [userId, refreshFlag]);

  // booklist와 setBookList 둘 다 반환
  return {booklist, setBookList};
};

export default useFetchBookList;
