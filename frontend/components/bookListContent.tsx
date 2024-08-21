import React from "react";
import { View, Text, Image } from "react-native";

import HomeScreenStyles from "../styles/homeScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import PlayIcon from "../assets/icons/play.svg";
// Props 타입 정의
interface BookListContentProps {
  title: string;
  genre: string;
  createAt: string;
  bookCoverUri: string;
}

// 함수형 컴포넌트 정의
function BookListContent(props: BookListContentProps) {
  const { title, genre, createAt, bookCoverUri } = props;

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
      <PlayIcon width={32} height={32} />
    </View>
  );
}

export default BookListContent;
