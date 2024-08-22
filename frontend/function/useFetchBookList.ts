import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // Redux store의 RootState 타입 임포트

// Define BookProp interface
export interface BookProp {
    bookId: number;
    title: string;
    genre: string;
    createAt: string;
    bookCoverUri: string;
}

const useFetchBookList = () => {
  const [booklist, setBookList] = useState<BookProp[]>([]);
  const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux에서 user ID 가져오기

  useEffect(() => {
    const fetchBookList = async () => {
      if (!userId) return; // 로그인된 사용자 ID가 없으면 요청하지 않음

      try {
        const response = await axios.get('http://192.168.56.1:3000/api/bookList', {
          params: {
            user_id: userId, // Redux에서 가져온 user ID 사용
          },
        });

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
  }, [userId]); // userId가 변경될 때마다 fetchBookList 실행

  return booklist;
};

export default useFetchBookList;