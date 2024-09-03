import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase, RouteProp } from "@react-navigation/native";
import axios from "axios";

import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";
import CreateBookStyles from "../styles/createBookScreenStyle";

import TopNavigator from "../components/topNavigator";
import { useCreateBook } from "../contexts/createBookContext";
import {REACT_NATIVE_BACKEND_IP} from '@env';

interface Keyword {
    keyword_id: number;
    keyword_name: string;
}

interface MyParams { 
    genreId: number;
}

function CreateBookScreen2({navigation, route}: {navigation: NavigationProp<ParamListBase>, route: RouteProp<ParamListBase>}) {
    const { genreId } = route.params as MyParams;
    
    const [keyWordsInput, setKeyWordsInput] = useState<Keyword[]>([]);
    const { bookData, setBookData } = useCreateBook();
    const [selectedKeywordNames, setSelectedKeywordNames] = useState<string[]>([]); // 이름 기반으로 상태 관리

    const onNextButton = async () => {
        // bookData에 선택된 키워드 이름들을 저장
        setBookData(prevData => {
            const updatedBookData = {
                ...prevData,
                keyword: selectedKeywordNames,
            };
            
            // bookData가 업데이트된 후에 네비게이션을 실행
            navigation.navigate("CreateBook3");

            return updatedBookData;
        });
    };

    useEffect(() => {
        // 키워드가 업데이트된 후에 네비게이션을 처리
        if (bookData.keyword.length > 0) {
            console.log(bookData);
        }
    }, [bookData.keyword]);

    // 키워드를 선택하거나 선택 해제하는 함수
    const toggleKeywordSelection = (keywordName: string) => {
        if (selectedKeywordNames.includes(keywordName)) {
            // 이미 선택된 키워드라면 배열에서 제거
            setSelectedKeywordNames(selectedKeywordNames.filter(name => name !== keywordName));
        } else {
            // 선택되지 않은 키워드라면 배열에 추가
            setSelectedKeywordNames([...selectedKeywordNames, keywordName]);
        }
    };

    const getGenre = async () => {
        try {
            const response = await axios.get(`http://${REACT_NATIVE_BACKEND_IP}:3000/api/keywordList`,{
                params:{
                    genre_id: genreId,
                }
            });
            //console.log(response.data.keywords);
            setKeyWordsInput(response.data.keywords);
        } catch (error) {
            console.log("Fail to fetch Genres", error);
        }
    };

    useEffect(() => {
        getGenre();
        console.log(keyWordsInput);
    }, []);

    return (
        <KeyboardAvoidingView style={[GlobalStyles.container]}>
            <ScrollView
                contentContainerStyle={{ 
                    flex: 1,
                    paddingHorizontal: 0,
                }} 
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps="handled"
            >
                <TopNavigator 
                navigation={navigation} 
                title="동화생성" 
                showBackButton={true}
                showTitle={true}
                />

                <View style={GlobalStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 22 }]}>
                        동화의 키워드를 선택해주세요
                    </Text>
                </View>
                
                <View style={[GlobalStyles.content, { flexDirection: "row", flexWrap: 'wrap' }]}>
                    {keyWordsInput.map((keyWord, index) => {
                        const isSelected = selectedKeywordNames.includes(keyWord.keyword_name); // 선택된 키워드인지 확인
                        return (
                            <TouchableOpacity 
                                activeOpacity={0.7}
                                key={keyWord.keyword_id}
                                style={[
                                    CreateBookStyles.keyWordButton,
                                    { backgroundColor: isSelected ? '#3B73E8' : '#EDEDED' }  // 선택된 경우 색상을 변경
                                ]}
                                onPress={() => toggleKeywordSelection(keyWord.keyword_name)} // 클릭 시 선택/해제
                            >
                                <Text style={[GlobalStyles.mediumText, { fontSize: 14, color: isSelected ? 'white' : 'black' }]}>
                                    {keyWord.keyword_name}
                                </Text>    
                            </TouchableOpacity>
                        ); 
                    })}
                </View>
                
                <View style={[
                    loginStyles.inputContainer,
                    {
                        flex: 1,
                        justifyContent: 'flex-end',
                        paddingBottom: 48,
                    }
                ]}>
                    <TouchableOpacity 
                        onPress={onNextButton}
                        activeOpacity={0.7}
                        style={[loginStyles.loginButton]}
                    >
                        <Text style={[GlobalStyles.semiBoldText, { color: 'white' }]}>
                            다음
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default CreateBookScreen2;
