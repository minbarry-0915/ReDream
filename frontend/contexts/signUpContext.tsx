import React, {createContext, useState, useContext, ReactNode} from 'react';

// Context의 타입 정의
interface UserData {
  name: string;
  id: string;
  password: string;
  birthDate: string; // 생일 추가
}

interface SignUpContextType {
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
}

// Context 기본값 설정
const defaultContextValue: SignUpContextType = {
  userData: {name: '', id: '', password: '', birthDate: ''},
  setUserData: () => {}, // 기본값은 빈 함수
};

// Context 생성
const SignUpContext = createContext<SignUpContextType>(defaultContextValue);

// Custom hook for using context
export const useSignUp = () => useContext(SignUpContext);

// Context Provider 컴포넌트
export const SignUpProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    id: '',
    password: '',
    birthDate: '', // 생일 초기값
  });

  return (
    <SignUpContext.Provider value={{userData, setUserData}}>
      {children}
    </SignUpContext.Provider>
  );
};
