import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View, KeyboardAvoidingView, ScrollView } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { RootState } from "../redux/store";
import GlobalStyles from "../styles/globalStyle";
import HomeScreenStyles from "../styles/homeScreenStyle";
import useFetchBookList from '../function/useFetchBookList';
import useDeleteBook from "../function/useDeleteBook";
import BookListContent from "../components/bookListContent";
import EditIcon from '../assets/icons/edit.svg';
import EditCompleteIcon from '../assets/icons/edit_complete.svg';
import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/animationStyle";

function BookMarkScreen({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
    const [editMode, setEditMode] = useState<boolean>(false);
    const [refreshFlag, setRefreshFlag] = useState<boolean>(false); // 리프레시 플래그
    const [isModalVisible, setModalVisible] = useState<boolean>(false);
    const [selectedBookId, setSelectedBookId] = useState<number | null>(null);

    const { booklist, setBookList } = useFetchBookList(refreshFlag); // Custom hook 사용
    const { deleteBook, loading } = useDeleteBook(); // Custom hook 사용
    const userId = useSelector((state: RootState) => state.auth.user?.id); // Redux state에서 user ID 가져오기
    
    const sampleloading = true;

    const onBookListEdit = () => {
        setEditMode(!editMode);
    };

    const onBookListEditComplete = () => {
        setEditMode(!editMode);
    };

    const handleDelete = (bookId: number) => {
        setSelectedBookId(bookId);
        setModalVisible(true);
    };

    const confirmDelete = () => {
        if (selectedBookId !== null) {
            deleteBook(selectedBookId).then(() => {
                setBookList((prevList) => prevList.filter((book) => book.bookId !== selectedBookId));
                setModalVisible(false); // 모달 닫기
                setEditMode(!editMode);
                setRefreshFlag(prev => !prev); // 화면 리프레시
            }).catch((error) => {
                // 에러 처리
                console.error(error);
                setModalVisible(false); // 모달 닫기
            });
        }
    };

    const cancelDelete = () => {
        setModalVisible(false); // 모달 닫기
        setEditMode(!editMode);
    };

    return (
        <KeyboardAvoidingView style={[GlobalStyles.container, { justifyContent: "flex-start", alignItems: 'center', backgroundColor: '#F0F0F0' }]}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{ flexGrow: 1, width: "100%" }}
            >
                {/* 북마크 */}
                <View style={GlobalStyles.topNavigatorContainer}>
                    <Text style={[GlobalStyles.BoldText, { fontSize: 32 }]}>북마크</Text>
                </View>

                {/* 책 리스트 */}
                <View style={HomeScreenStyles.content}>
                    <View style={HomeScreenStyles.bookListHeaderContainer}>
                        <Text style={[GlobalStyles.semiBoldText, { fontSize: 18 }]}>저장된 동화 목록</Text>
                        {editMode ? (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onBookListEditComplete}
                                style={HomeScreenStyles.bookListEditButton}
                            >
                                <Text style={[GlobalStyles.mediumText, { fontSize: 18, color: '#E93B3B', marginRight: 8 }]}>완료</Text>
                                <EditCompleteIcon width={14} height={14} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onBookListEdit}
                                style={HomeScreenStyles.bookListEditButton}
                            >
                                <Text style={[GlobalStyles.mediumText, { fontSize: 18, color: '#3C3C3C', marginRight: 8 }]}>편집</Text>
                                <EditIcon width={14} height={14} />
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={HomeScreenStyles.bookListContainer}>
                        {booklist.map((book) => (
                            <BookListContent
                                key={book.bookId}
                                bookId={book.bookId}
                                title={book.title}
                                genre={book.genre}
                                createAt={book.createAt}
                                bookCoverUri={book.bookCoverUri}
                                navigation={navigation}
                                editMode={editMode}
                                onDelete={handleDelete} // 삭제 트리거
                            />
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* 삭제 확인 모달 */}
            <Modal
                transparent={true}
                visible={isModalVisible}
                animationType="fade"
                onRequestClose={cancelDelete}
            >
                <View style={GlobalStyles.messegeModalContainer}>
                    <View style={GlobalStyles.messegeModalContent}>
                        {loading ? (
                            <>
                            <Text style={[GlobalStyles.semiBoldText,{fontSize: 16}]}>삭제중이에요</Text>
                            <Loading style={[AnimationStyles.loading, {width: 100, height: 100}]}/>
                            </>
                            
                        ):(
                            <>
                            <Text style={[GlobalStyles.semiBoldText,{fontSize: 16}]}>해당 동화가 삭제됩니다.</Text>
                            <View style={GlobalStyles.messegeModalButtonsContainer}>
                                <TouchableOpacity 
                                style={GlobalStyles.deleteConfirmbutton}
                                activeOpacity={0.7}
                                onPress={confirmDelete}
                                >
                                    <Text style={[GlobalStyles.BoldText,{width: 41,textAlign: 'center',fontSize: 16, color: 'white'}]}>네</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[
                                    GlobalStyles.deleteConfirmbutton,{backgroundColor: 'white', borderWidth: 1}]
                                }
                                activeOpacity={0.7}
                                onPress={cancelDelete}
                                >
                                    <Text style={[GlobalStyles.BoldText,{width: 41,textAlign: 'center',fontSize: 16, color: 'black'}]}>아니오</Text>
                                </TouchableOpacity>
                            </View>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}

export default BookMarkScreen;
