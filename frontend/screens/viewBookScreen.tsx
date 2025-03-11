import React, {useEffect, useRef, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  RouteProp,
} from '@react-navigation/native';
import {
  Image,
  View,
  Text,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import useGetBook, {BookData} from '../function/useGetBook';
import GlobalStyles from '../styles/globalStyle';
import TopNavigator from '../components/topNavigator';
import AnimationStyles from '../styles/animationStyle';
import LoadingModal from '../components/loadingModal';
import Error from '../components/animations/error';
import loginStyles from '../styles/loginScreenStyle';
import ViewBookStyles from '../styles/viewBookScreenStyle';
import StartIcon from '../assets/icons/start.svg';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Carousel from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
import ArrowLeftIcon from '../assets/icons/arrowLeft.svg';
import ArrowRightIcon from '../assets/icons/arrowRight.svg';
import AudioPlayer from '../components/audioPlayer';
import EndModal from '../components/endModal';
import ExitModal from '../components/exitModal';

interface MyParams {
  Id: number;
}

interface Paragraph {
  paragraph_id: number;
  book_id: number;
  text: string;
  image_path: string;
  audio_path: string;
}

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

function ViewBookScreen({
  navigation,
  route,
}: {
  navigation: NavigationProp<ParamListBase>;
  route: RouteProp<ParamListBase>;
}) {
  const {Id} = route.params as MyParams;
  const [showCarousel, setShowCarousel] = useState<boolean>(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const carouselRef = useRef(null);
  const [endModalVisible, setEndModalVisible] = useState<boolean>(false);
  const [closeModalVisible, setCloseModalVisible] = useState<boolean>(false);

  const sampleLoading = true;
  const {bookData, loading, error} = useGetBook(Id);

  if (loading) {
    return (
      <KeyboardAvoidingView style={[GlobalStyles.container]}>
        <ScrollView
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: 0,
          }}
          keyboardDismissMode="interactive"
          keyboardShouldPersistTaps="handled">
          <LoadingModal
            version="viewBook"
            navigation={navigation}
            modalVisible={true}
            initialText="그림을 그리고 있어요"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  if (error) {
    const onGoBackButton = () => {
      navigation.goBack();
    };
    return (
      <KeyboardAvoidingView style={[GlobalStyles.container]}>
        <TopNavigator navigation={navigation} />
        <Error style={AnimationStyles.error} />

        <View style={[GlobalStyles.content, {alignItems: 'center'}]}>
          <Text style={[GlobalStyles.semiBoldText, {fontSize: 24}]}>
            오류가 발생했어요!
          </Text>
          <Text style={[GlobalStyles.semiBoldText, {fontSize: 24}]} />
        </View>

        <View
          style={[
            loginStyles.inputContainer,
            {
              flex: 1,
              justifyContent: 'flex-end',
              paddingBottom: 48,
            },
          ]}>
          <TouchableOpacity
            onPress={onGoBackButton}
            activeOpacity={0.7}
            style={[loginStyles.loginButton, {backgroundColor: '#E93B3B'}]}>
            <Text style={[GlobalStyles.semiBoldText, {color: 'white'}]}>
              홈화면으로 돌아가기
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const onStartButton = () => {
    setShowCarousel(true);
    // ScrollView의 carousel 위치로 스크롤
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: screenHeight, animated: true});
    } else {
      console.log('ScrollView Ref is still null');
    }
  };

  const handleSnapToItem = (index: number) => {
    if (bookData) {
      if (index === bookData.paragraphs.length - 1) {
        // 마지막 항목에 도달했을 때 처리
        console.log('Reached the last item');
      }
      const nextIndex =
        currentIndex + 1 < bookData.paragraphs.length ? currentIndex + 1 : 0;
      setCurrentIndex(nextIndex);
      setPlayingIndex(nextIndex); // 새로운 인덱스에 대해 오디오 재생 시작
    }
  };

  // 다음 슬라이드로 이동
  const handleNext = () => {
    if (bookData) {
      const nextIndex =
        currentIndex + 1 < bookData.paragraphs.length ? currentIndex + 1 : 0;
      setCurrentIndex(nextIndex);
      setPlayingIndex(nextIndex); // 새로운 인덱스에 대해 오디오 재생 시작
    }
  };

  // 이전 슬라이드로 이동
  const handlePrevious = () => {
    if (bookData) {
      const prevIndex =
        currentIndex - 1 >= 0
          ? currentIndex - 1
          : bookData.paragraphs.length - 1;
      setCurrentIndex(prevIndex);
      setPlayingIndex(prevIndex); // 새로운 인덱스에 대해 오디오 재생 시작
    }
  };

  const handleEnd = () => {
    setShowCarousel(false);

    setEndModalVisible(!endModalVisible);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({y: screenHeight, animated: true});
    } else {
      console.log('ScrollView Ref is still null');
    }
  };

  const handleClose = () => {
    setCloseModalVisible(true);
  };

  const isLastIndex = (index: number) =>
    bookData ? index === bookData.paragraphs.length - 1 : false;

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <ScrollView ref={scrollViewRef} scrollEnabled={false}>
        {bookData ? (
          <ImageBackground
            source={{uri: bookData.book.cover_image_path}}
            style={ViewBookStyles.imageContainer}
            resizeMode="cover">
            <View style={[ViewBookStyles.imageContainer]}>
              <TopNavigator
                navigation={navigation}
                title="동화재생"
                showBackButton={true}
              />
              <View style={ViewBookStyles.titleContainer}>
                <Text
                  style={[
                    GlobalStyles.semiBoldText,
                    {fontSize: 32, color: 'white', paddingBottom: 24},
                  ]}>
                  {bookData.book.title}
                </Text>
                <TouchableOpacity activeOpacity={0.7} onPress={onStartButton}>
                  <StartIcon style={[GlobalStyles.startIcon]} />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        ) : null}

        {showCarousel && bookData && (
          <View style={ViewBookStyles.carouselContainer}>
            <GestureHandlerRootView>
              <Carousel
                ref={carouselRef} // Ref to access Carousel methods
                data={bookData.paragraphs}
                onSnapToItem={index => setCurrentIndex(index)} // 현재 인덱스 업데이트
                width={screenWidth}
                height={screenHeight} // 원하는 높이로 설정
                defaultIndex={currentIndex} // 현재 인덱스 설정
                renderItem={({item, index}) => (
                  <View>
                    <ImageBackground
                      source={{uri: item.image_path}}
                      style={{width: screenWidth, height: screenHeight}}
                      resizeMode="cover">
                      <LinearGradient
                        colors={[
                          'rgba(0, 0, 0, 0.3)',
                          'rgba(0, 0, 0, 0.7)',
                          '#000000',
                        ]}
                        style={ViewBookStyles.linearGradient}>
                        <View
                          style={{
                            width: '100%',
                            position: 'absolute',
                            top: 0,
                          }}>
                          <TopNavigator
                            navigation={navigation}
                            title="ViewBook"
                            showCloseButton={true}
                            onCloseButtonPress={handleClose} // Close 버튼 클릭 시 실행할 함수
                          />
                        </View>

                        <View style={GlobalStyles.content}>
                          <AudioPlayer uri={item.audio_path} />
                        </View>
                        <View style={GlobalStyles.content}>
                          <Text
                            style={[
                              GlobalStyles.semiBoldText,
                              {fontSize: 18, color: 'white'},
                            ]}>
                            {item.text}
                          </Text>
                        </View>
                        <View
                          style={[
                            GlobalStyles.content,
                            {
                              paddingHorizontal: 24,
                              justifyContent: 'flex-end',
                              flexDirection: 'row',
                              marginBottom: 74,
                            },
                          ]}>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={handlePrevious} // 이전 슬라이드로 이동
                            disabled={currentIndex === 0} // 첫 번째 슬라이드에서는 이전으로 이동 비활성화
                          >
                            <ArrowLeftIcon width={60} height={60} />
                          </TouchableOpacity>
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={
                              isLastIndex(currentIndex) ? handleEnd : handleNext
                            } // 이전 슬라이드로 이동
                          >
                            <ArrowRightIcon width={60} height={60} />
                          </TouchableOpacity>
                        </View>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                )}
              />
            </GestureHandlerRootView>
          </View>
        )}

        {endModalVisible && (
          <EndModal navigation={navigation} modalVisible={endModalVisible} />
        )}

        {closeModalVisible && (
          <ExitModal
            navigation={navigation}
            modalVisible={closeModalVisible}
            onClose={() => setCloseModalVisible(false)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
export default ViewBookScreen;
