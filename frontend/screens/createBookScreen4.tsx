import React, { useEffect, useRef, useState } from "react";
import { Animated, KeyboardAvoidingView, Modal, Platform, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import SignUpStyles from "../styles/signUpScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import loginStyles from "../styles/loginScreenStyle";
import TopNavigator from "../components/topNavigator";
import { useCreateBook } from "../contexts/createBookContext";

import Loading from "../components/animations/loading";
import AnimationStyles from "../styles/animationStyle";
import useCreateBookServerRequest from "../function/useCreateBook";

function CreateBookScreen4({navigation}:{navigation: NavigationProp<ParamListBase>}){
    const { bookData, setBookData } = useCreateBook();
    const [errorMessege, setErrorMessege] = useState(false);
    const [ titleInput, setTitleInput] = useState('');

    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [text, setText] = useState('그림을 만들고 있어요');
    const fadeAnim = useRef(new Animated.Value(0)).current; // 초기 opacity 값 0

    

    const handleError = () => {
        console.error('Failed to create book');
        // 에러 처리 로직
        setModalVisible(false);
        navigation.navigate('CreateFail');
    };

    const handleSuccess = () => {
        console.log('Successfully created book');
        setModalVisible(false); // 모달을 닫거나 다른 성공 처리
        navigation.navigate('CreateSuccess');
    };

    const createBook = useCreateBookServerRequest(handleError, handleSuccess);
    
    const onNextButton = async () => {
        if (titleInput === "") {
            setErrorMessege(true);
            return;
        }
    
        setBookData(prevData => ({
            ...prevData,
            title: titleInput,
        }));
        setModalVisible(true);       
    };

    useEffect(() => {
        const createBookData = async () => {
            if (bookData.title) {
                console.log(bookData);
                try {
                    await createBook(); // 비동기 함수 호출 및 완료를 기다립니다
                    handleSuccess();
                } catch (error) {
                    console.error('Error occurred while creating book:', error);
                    handleError();
                    // 필요시 추가적인 오류 처리 로직을 여기에 작성할 수 있습니다.
                }
            }
        };

        createBookData(); // 비동기 함수 호출
    }, [bookData.title]); // bookData.title이 변경될 때마다 useEffect 실행

    useEffect(() => {
        if (titleInput === "") {
            setErrorMessege(true);
        } else {
            setErrorMessege(false);
        }
    }, [titleInput]);

    useEffect(() => {
        const interVal = setInterval(() => {
            // 텍스트를 먼저 변경하고 페이드 인 애니메이션 실행
            setText(prevText => {
                if (prevText === '그림을 만들고 있어요') {
                    return '음성을 생성하고 있어요';
                } else if (prevText === '음성을 생성하고 있어요') {
                    return '동화를 생성하고 있어요';
                } else {
                    return '그림을 만들고 있어요';
                }
            });
        }, 3000); // 3초 간격으로 텍스트 변경

        return () => clearInterval(interVal);
    }, []);

    useEffect(() => {
        fadeIn(); // 텍스트가 변경될 때마다 페이드 인 애니메이션 실행
    }, [text]);

    // 페이드 인 애니메이션
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1, // opacity 1로
            duration: 500, // 애니메이션 지속 시간 0.5초
            useNativeDriver: true,
        }).start(() => fadeOut()); // 페이드 인 완료 후 페이드 아웃 시작
    };

    // 페이드 아웃 애니메이션
    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0, // opacity 0으로
            duration: 500, // 애니메이션 지속 시간 0.5초
            useNativeDriver: true,
            delay: 2000, // 텍스트가 표시된 후 2초 후에 페이드 아웃
        }).start();
    };

    return(
        <KeyboardAvoidingView 
        style={[GlobalStyles.container]}>
            <ScrollView 
            contentContainerStyle={{ 
                flex: 1,
                paddingHorizontal: 0,
                }} 
            keyboardDismissMode='interactive'
            keyboardShouldPersistTaps="handled">
                <TopNavigator 
                navigation={navigation} 
                title="동화생성" 
                showBackButton={true}
                showTitle={true}
                />

                <View style={GlobalStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, {fontSize: 22}]}>
                        동화의 제목을 입력해주세요
                    </Text>
                </View>

                <View style={GlobalStyles.content}>
                    <TextInput
                    placeholderTextColor={"black"}
                    onChangeText={setTitleInput}
                    value={titleInput}
                    style={SignUpStyles.inputContainer}
                    />
                </View>

                {errorMessege? (
                    <View style={GlobalStyles.content}>
                        <Text style={GlobalStyles.lightText}>
                            제목을 입력해주세요
                        </Text>
                    </View>
                ): null}

                <View style={
                    [loginStyles.inputContainer, 
                    {flex: 1,
                    justifyContent:'flex-end',
                    paddingBottom: 48,
                    }
                ]}>
                    <TouchableOpacity 
                    onPress={onNextButton}
                    activeOpacity={0.7}
                    style={[loginStyles.loginButton]}>
                        <Text style={[GlobalStyles.semiBoldText,{color: 'white'}]}>
                            생성하기
                        </Text>
                    </TouchableOpacity>
                </View>

                <Modal 
                transparent={false}
                animationType="fade"
                visible={modalVisible}
                onRequestClose={()=>setModalVisible(false)}
                >
                    <View style={[GlobalStyles.container,{alignItems: 'center', justifyContent: 'center'}]}>
                        <Loading style={AnimationStyles.loading}/>
                        <View style={[GlobalStyles.content,{alignItems: 'center'}]}>
                            <Animated.Text style={[GlobalStyles.semiBoldText, { fontSize: 24, opacity: fadeAnim }]}>{text}</Animated.Text>
                            <Animated.Text style={[GlobalStyles.semiBoldText, { fontSize: 24, opacity: fadeAnim }]}>잠시만 기다려주세요</Animated.Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>   
        </KeyboardAvoidingView>
    )
    
}

export default CreateBookScreen4;