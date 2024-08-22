import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useSelector } from 'react-redux'; // Redux 사용
import { RootState } from '../redux/store';

// Context의 타입 정의
interface BookData {
    user_id: string;
    title: string;
    genre: string;
    keyword: string[];
    description: string;
}

interface CreateBookContextType {
    bookData: BookData;
    setBookData: React.Dispatch<React.SetStateAction<BookData>>;
}

// Context 기본값 설정
const defaultContextValue: CreateBookContextType = {
    bookData: { user_id: '', title: '', genre: '', keyword: [], description: '' },
    setBookData: () => {}, // 기본값은 빈 함수
};

// Context 생성
const CreateBookContext = createContext<CreateBookContextType>(defaultContextValue);

// Custom hook for using context
export const useCreateBook = () => useContext(CreateBookContext);

// Context Provider 컴포넌트
export const CreateBookProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    if (!userId) {
        throw new Error("User is not logged in. User ID is required.");
    }

    const [bookData, setBookData] = useState<BookData>({
        title: '',
        genre: '',
        keyword: '',
        description: '',
        user_id: userId, // user_id 초기값 설정
    });

    return (
        <CreateBookContext.Provider value={{ bookData, setBookData }}>
            {children}
        </CreateBookContext.Provider>
    );
};
