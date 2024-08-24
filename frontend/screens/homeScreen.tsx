import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store'; // RootState를 가져옵니다.
import { NavigationProp, ParamListBase } from "@react-navigation/native";
// styles
import HomeScreenStyles from "../styles/homeScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";
// Icons
import PlusIcon from "../assets/icons/plus.svg";
// Components Functions
import BookListContent from "../components/bookListContent";
import useFetchBookList from '../function/useFetchBookList';
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/animationStyle";

function HomeScreen({navigation}:{navigation: NavigationProp<ParamListBase>}) {
    const booklist = useFetchBookList(); // Custom hook 사용
    const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux state에서 user ID 가져오기

    const onCreateButton = () => {
        navigation.navigate("CreateBook");
    }
    
    return (
        <KeyboardAvoidingView style={[GlobalStyles.container, { justifyContent: "flex-start", alignItems: 'center', backgroundColor: '#F0F0F0' }]}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            style={{flexGrow: 1, width: "100%"}}
            >
                {/* 대시보드 */}
                <View style={GlobalStyles.topNavigatorContainer}>
                    <Text style={[GlobalStyles.BoldText, { fontSize: 32 }]}>대시보드</Text>
                </View>

                {/* 생성하기 버튼 */}
                <View style={HomeScreenStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 18, marginBottom: 24 }]}>새로운 동화를 생성해보세요</Text>
                    <View style={[loginStyles.inputContainer, { paddingHorizontal: 0 }]}>
                        <TouchableOpacity
                            onPress={onCreateButton}
                            activeOpacity={0.7}
                            style={[loginStyles.loginButton, { borderRadius: 20, paddingVertical: 24 }]}
                        >
                            <View style={{ marginBottom: 4 }}>
                                <PlusIcon width={20} height={20} />
                            </View>
                            <Text style={[GlobalStyles.semiBoldText, { fontSize: 16, color: 'white' }]}>
                                생성하기
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* 책 리스트 */}
                <View style={HomeScreenStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 18, marginBottom: 24 }]}>저장된 동화 목록</Text>
                    <View style={HomeScreenStyles.bookListContainer}>
                        {booklist.map((book) => (
                            <BookListContent
                                key={book.bookId}
                                title={book.title}
                                genre={book.genre}
                                createAt={book.createAt}
                                bookCoverUri={book.bookCoverUri}
                                navigation={navigation}
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default HomeScreen;
