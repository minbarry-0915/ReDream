import React from "react";
import { TouchableOpacity, View, Text } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import GlobalStyles from "../styles/globalStyle";
import HomeIcon from "../assets/icons/home.svg";
import BookMarkIcon from "../assets/icons/bookmark.svg";
import UserIcon from "../assets/icons/user.svg";

// Props 타입 정의
interface BottomNavigatorProps {
  navigation: NavigationProp<ParamListBase>;
}

// 함수형 컴포넌트 정의
function BottomNaviatorContainer({ navigation }: BottomNavigatorProps) {

  const onHomeButton = () => {
    navigation.navigate("Home"); // 예를 들어 Home 화면으로 이동
  };

  const onBookMarkButton = () => {
    navigation.navigate("BookMark"); // 예를 들어 BookMark 화면으로 이동
  };

  const onMyPageButton = () => {
    navigation.navigate("MyPage"); // 예를 들어 MyPage 화면으로 이동
  };

  return (
    <View style={GlobalStyles.bottomNavigatorContainer}>
      {/* 북마크 */}
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onBookMarkButton}
        style={GlobalStyles.bottomNavigatorContent}
      >
        <BookMarkIcon width={24} height={24}/>
        <Text style={[GlobalStyles.mediumText, {fontSize: 12, marginTop: 4, color: "#3C3C3C"}]}>
          북마크
        </Text>
      </TouchableOpacity>

      {/* 홈버튼 */}
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onHomeButton}
        style={GlobalStyles.bottomNavigatorContent}
      >
        <HomeIcon width={24} height={24}/>
        <Text style={[GlobalStyles.mediumText, {fontSize: 12, marginTop: 4}]}>
          홈
        </Text>
      </TouchableOpacity>

      {/* 마이페이지 */}
      <TouchableOpacity 
        activeOpacity={0.7}
        onPress={onMyPageButton}
        style={[GlobalStyles.bottomNavigatorContent, {marginRight: 0}]}
      >
        <UserIcon width={24} height={24}/>
        <Text style={[GlobalStyles.mediumText, {fontSize: 12, marginTop: 4}]}>
          마이페이지
        </Text>
      </TouchableOpacity> 
    </View>
  );
}

export default BottomNaviatorContainer;
