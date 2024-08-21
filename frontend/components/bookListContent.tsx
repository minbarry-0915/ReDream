import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import HomeScreenStyles from "../styles/homeScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import PlayIcon from "../assets/icons/play.svg";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
// Props 타입 정의
interface BookListContentProps {
  title: string;
  genre: string;
  createAt: string;
  bookCoverUri: string;
  navigation: NavigationProp<ParamListBase>
}

// 함수형 컴포넌트 정의
function BookListContent(props: BookListContentProps) {
  const { title, genre, createAt, bookCoverUri, navigation } = props;
  const onPlayButton = () =>{
    navigation.navigate('')
  }
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
      onPress={onPlayButton}
      >
        <PlayIcon width={32} height={32} />
      </TouchableOpacity>
    </View>
  );
}

export default BookListContent;
