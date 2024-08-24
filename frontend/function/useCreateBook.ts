import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { useCreateBook } from "../contexts/createBookContext";
import { useCallback } from "react";
import axios from "axios";

const useCreateBookServerRequest = (onError: () => void, onSuccess: () => void) => {
    const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux에서 user ID 가져오기
    const { bookData } = useCreateBook();

    const createBook = useCallback(async () => {
        if (!userId) return;

        try {
            const response = await axios.post('http://192.168.56.1:3000/api/book/create', {
                user_id: userId,
                title: bookData.title,
                genre: bookData.genre,
                keyword: bookData.keyword.join(','),
                description: bookData.description
            }, {
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.status === 200) {
                console.log('Book Creation Successfully Done');
                onSuccess(); // 성공 콜백 호출
            } else {
                throw new Error('Unexpected Response Status');
            }
        } catch (error) {
            console.error('Book Creation Failed:', error);
            onError(); // 오류 콜백 호출
        }
    }, [userId, bookData, onError, onSuccess]);

    return createBook;
};

export default useCreateBookServerRequest;
