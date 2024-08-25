import React, { useEffect, useRef } from "react";
import { View, Text, Image, TouchableOpacity, Animated } from "react-native";
import HomeScreenStyles from "../styles/homeScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import PlayIcon from "../assets/icons/play.svg";
import DeleteIcon from "../assets/icons/delete.svg"; // 추가
import { NavigationProp, ParamListBase } from "@react-navigation/native";

// Props 타입 정의
interface BookListContentProps {
  bookId: number;
  title: string;
  genre: string;
  createAt: string;
  bookCoverUri: string;
  navigation: NavigationProp<ParamListBase>;
  editMode: boolean;
  onDelete?: (bookId: number) => void;
}

// 함수형 컴포넌트 정의
function BookListContent(props: BookListContentProps) {
  const { bookId, title, genre, createAt, bookCoverUri, navigation, editMode, onDelete } = props;

  const onButtonPress = () => {
    if (editMode) {
      // Edit mode에서의 행동
      if (onDelete) {
        onDelete(bookId); // 부모 컴포넌트에 삭제 요청
      }
    } else {
      // Play mode에서의 행동
      //navigation.navigate('BookDetail'); // 예시로 BookDetail 화면으로 이동
    }
  };

  // Animated 값 정의
  const iconScale = useRef(new Animated.Value(1)).current;
  const iconOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.timing(iconScale, {
      toValue: editMode ? 1.1 : 1, // 확대/축소
      duration: 300,
      useNativeDriver: true
    }).start();

    Animated.timing(iconOpacity, {
      toValue: editMode ? 0.7 : 1, // 불투명도
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [editMode]);

  return (
    <View style={HomeScreenStyles.bookListContent}>
      <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }}>
        <View style={HomeScreenStyles.bookListImageContainer}>
          <Image 
            source={{ uri: bookCoverUri }}
            style={HomeScreenStyles.bookListImage}
          />
        </View>
        <View style={HomeScreenStyles.bookListTextContainer}>
          <Text style={[GlobalStyles.mediumText, { fontSize: 14, marginBottom: 4 }]}>{title}</Text>
          <Text style={[GlobalStyles.regularText, { fontSize: 12, color: '#696969', marginBottom: 4 }]}>{genre}</Text>
          <Text style={[GlobalStyles.regularText, { fontSize: 12, color: '#696969', marginBottom: 4 }]}>{createAt}</Text>
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onButtonPress}
      >
         <Animated.View style={{
          transform: [{ scale: iconScale }],
        }}>
        {editMode ? (
          <DeleteIcon width={32} height={32} /> // Edit mode에서 버튼 아이콘 변경
        ) : (
          <PlayIcon width={32} height={32} /> // Play mode에서 버튼 아이콘 유지
        )}
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}

export default BookListContent;
