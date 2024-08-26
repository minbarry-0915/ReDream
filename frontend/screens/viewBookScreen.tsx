import React, { useEffect, useRef, useState } from "react";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import { Image, View, Text, Dimensions, KeyboardAvoidingView, ScrollView, TouchableOpacity, SafeAreaView, ImageBackground } from "react-native";
import useGetBook from "../function/useGetBook";
import GlobalStyles from "../styles/globalStyle";
import TopNavigator from "../components/topNavigator";
import AnimationStyles from "../styles/animationStyle";
import LoadingModal from "../components/loadingModal";
import Error from "../components/animations/error";
import loginStyles from "../styles/loginScreenStyle";
import ViewBookStyles from "../styles/viewBookScreenStyle";
import StartIcon from "../assets/icons/start.svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Carousel from 'react-native-reanimated-carousel';

interface MyParams{
    Id: number
}

interface Paragraph {
    paragraph_id: number;
    book_id: number;
    text: string;
    image_path: string;
    audio_path: string;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

function ViewBookScreen({navigation, route}: {navigation: NavigationProp<ParamListBase>, route: RouteProp<ParamListBase>}){
    const {Id} = route.params as MyParams;
    const [showCarousel, setShowCarousel] = useState<boolean>(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const sampleLoading = true;
    //console.log(Id);
    const { bookData, loading, error } = useGetBook(Id);
    
    //console.log(showCarousel);

    // useEffect(() => {
    //     if (bookData) {
    //     console.log([bookData.book, bookData.paragraphs]);
    //     }
    // }, [bookData]); // bookData가 변경될 때만 실행

    if(loading){
        return(
            <KeyboardAvoidingView style={[GlobalStyles.container]}>
                <ScrollView
                contentContainerStyle={{ 
                    flex: 1,
                    paddingHorizontal: 0,
                }} 
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps="handled"
                >                   
                    <LoadingModal
                    version="viewBook"
                    navigation={navigation}
                    modalVisible={true}
                    initialText="그림을 그리고 있어요"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }

    if(error){
        const onGoBackButton = () =>{
            navigation.goBack();
        };
        return(
            <KeyboardAvoidingView style={[GlobalStyles.container]}>
                <TopNavigator 
                navigation={navigation}
                />
                <Error style={AnimationStyles.error}/>
                
                <View style={[GlobalStyles.content,{alignItems: 'center'}]}>
                    
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>
                        오류가 발생했어요!
                    </Text>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 24 }]}>
                    </Text>
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
                        onPress={onGoBackButton}
                        activeOpacity={0.7}
                        style={[loginStyles.loginButton,{backgroundColor: '#E93B3B'}]}
                    >
                        <Text style={[GlobalStyles.semiBoldText, { color: 'white' }]}>
                            홈화면으로 돌아가기
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        );
    }

    const onStartButton = () =>{
        setShowCarousel(true);
        // ScrollView의 carousel 위치로 스크롤
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ y: screenHeight, animated: true });
        } else {
            console.log('ScrollView Ref is still null');
        }
    };

    const handleSnapToItem = (index: number) => {
        if(bookData){
            if (index === bookData.paragraphs.length - 1) {
                // 마지막 항목에 도달했을 때 처리
                console.log('Reached the last item');
            }
        }
      };

    return(
        <SafeAreaView
        style={GlobalStyles.container}
        >
            <ScrollView 
            ref={scrollViewRef}
            scrollEnabled={false}
            >
                {bookData?(
                    <ImageBackground
                        source={{uri: bookData.book.cover_image_path}}
                        style={ViewBookStyles.imageContainer}
                        resizeMode='cover'
                    >
                        
                        <View style={[ViewBookStyles.imageContainer]}>
                            <TopNavigator 
                            navigation={navigation}
                            title="동화재생"
                            showBackButton={true}                       
                            />
                            <View style={ViewBookStyles.titleContainer}>
                                <Text style={[GlobalStyles.semiBoldText,{fontSize: 32, color: 'white', paddingBottom: 24}]}>{bookData.book.title}</Text>
                                <TouchableOpacity
                                activeOpacity={0.7}
                                onPress={onStartButton}
                                >
                                    <StartIcon style={[GlobalStyles.startIcon]}/>
                                </TouchableOpacity>
                                
                            </View>
                        </View>

                    </ImageBackground>
                ) : (null)}
                {showCarousel && bookData && (
                <View style={ViewBookStyles.carouselContainer}>
                    <GestureHandlerRootView>
                    <Carousel
                        data={bookData.paragraphs}
                        onSnapToItem={handleSnapToItem}
                        width={screenWidth}
                        height={screenHeight} // 원하는 높이로 설정
                        renderItem={({ item }) => (
                        <View>
                            <Image source={{ uri: item.image_path }} style={{width: 400, height: 400}} />
                            <Text>{item.text}</Text>
                        </View>
                        )}
                    />
                    </GestureHandlerRootView>
                </View>
                )}
            </ScrollView>

            
            
        </SafeAreaView>
    );
}
export default ViewBookScreen;