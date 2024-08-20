import React from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import BottomNaviatorContainer from "../components/bottomNavigator";

import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import HomeScreenStyles from "../styles/homeScreenStyle";
import useFetchBookList from "../function/useFetchBookList";
import BookListContent from "../components/bookListContent";

import EditIcon from '../assets/icons/edit.svg';

function BookMarkScreen({navigation}: {navigation: NavigationProp<ParamListBase>}){
    const booklist = useFetchBookList(); // Custom hook 사용

    const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux state에서 user ID 가져오기
    
    const onBookListEdit = () =>{

    };
    return(
        <KeyboardAvoidingView style={[GlobalStyles.container, { justifyContent: "flex-start", alignItems: 'center', backgroundColor: '#F0F0F0' }]}>
            <ScrollView
            showsVerticalScrollIndicator={false}
            >
                {/* 북마크 */}
                <View style={GlobalStyles.topNavigatorContainer}>
                    <Text style={[GlobalStyles.BoldText, { fontSize: 32 }]}>북마크</Text>
                </View>

                {/* 책 리스트 */}
                <View style={HomeScreenStyles.content}>
                    <View style={HomeScreenStyles.bookListHeaderContainer}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 18}]}>저장된 동화 목록</Text>
                        <TouchableOpacity
                        activeOpacity={0.7}
                        onPress={onBookListEdit}
                        style={HomeScreenStyles.bookListEditButton}
                        >
                            <Text style={[GlobalStyles.mediumText, { fontSize: 18, color: '#3C3C3C', marginRight: 8}]}>편집</Text>
                            <EditIcon width={14} height={14}/>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={HomeScreenStyles.bookListContainer}>
                        {booklist.map((book) => (
                            <BookListContent
                                key={book.bookId}
                                title={book.title}
                                genre={book.genre}
                                createAt={book.createAt}
                                bookCoverUri={book.bookCoverUri}
                            />
                        ))}
                    </View>
                </View>
                
            </ScrollView>
            {/* <BottomNaviatorContainer navigation={navigation}/> */}
        </KeyboardAvoidingView>
    );
}
export default BookMarkScreen;