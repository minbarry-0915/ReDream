import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";
import CreateBookStyles from "../styles/createBookScreenStyle";

import TopNavigator from "../components/topNavigator";
import { useCreateBook } from "../contexts/createBookContext";

function CreateBookScreen3({navigation}: {navigation: NavigationProp<ParamListBase>}) {
    const { bookData, setBookData } = useCreateBook();
    const [ descriptionInput, setDescriptionInput] = useState('');
    const maxDescriptionLength: number = 100;
    const [errorMessege, setErrorMessege] = useState(false);

    const onNextButton = () => {
        setBookData(prevData => ({
            ...prevData,
            description: descriptionInput,
        }));
    };

    useEffect(() => {
        if (bookData.description) { // bookData.keyword가 업데이트되면
            console.log(bookData);
            navigation.navigate("CreateBook4");
        }
    }, [bookData.description, navigation]);

    const handleChangeDescription = (inputText: string) =>{
        setDescriptionInput(inputText);
    };

    useEffect(() => {
        if (descriptionInput.length > maxDescriptionLength) {
            setErrorMessege(true);
        } else {
            setErrorMessege(false);
        }
    }, [descriptionInput]);

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
                        추가하고 싶은 동화의 내용을 
                    </Text>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 22 }]}>
                        입력해주세요
                    </Text>
                </View>
                
                <View style={GlobalStyles.content}>
                    <ScrollView 
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}  // 필요에 따라 스크롤바 표시 여부 설정
                    >
                        <TextInput
                        style={CreateBookStyles.descriptionInputBox}
                        placeholder="세부 사항을 입력하세요"
                        multiline={true}  // 여러 줄 입력 가능
                        scrollEnabled={true}  // 텍스트가 넘칠 경우 스크롤 활성화
                        onChangeText={handleChangeDescription}
                        value={descriptionInput}
                        />
                    </ScrollView>
                </View>

                <View style={[GlobalStyles.content,{justifyContent: errorMessege? 'space-between': 'flex-end',flexDirection: 'row'}]}>
                    {errorMessege ? (
                        <Text style={[GlobalStyles.lightText,{color: '#E93B3B'}]}>글자 수가 초과되었습니다.</Text>
                    ): null}
                    <View  style={{flexDirection: 'row'}}>
                        <Text style={[GlobalStyles.lightText,{color: 'black'}]}>{descriptionInput.length}</Text>
                        <Text style={[GlobalStyles.lightText,{color: 'black'}]}>{[' / ',maxDescriptionLength]}</Text>
                    </View>
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

export default CreateBookScreen3;
