import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/homeScreen";
import BookMarkScreen from "../screens/bookMarkScreen.tsx";
import MyPageScreen from "../screens/myPageScreen.tsx";

import HomeIcon from "../assets/icons/home.svg";
import HomeFocusIcon from "../assets/icons/homeFocus.svg";
import BookMarkIcon from "../assets/icons/bookmark.svg";
import BookMarkFocusIcon from "../assets/icons/bookmarkFocus.svg";
import UserIcon from "../assets/icons/user.svg";
import UserFocusIcon from "../assets/icons/userFocus.svg";

const Tab = createBottomTabNavigator();

const getTabBarIcon = (routeName, focused) => {
  switch (routeName) {
    case 'Home':
      return focused ? <HomeFocusIcon width={28} height={28} /> : <HomeIcon width={26} height={26} />;
    case 'BookMark':
      return focused ? <BookMarkFocusIcon width={28} height={28} /> : <BookMarkIcon width={26} height={26} />;
    case 'MyPage':
      return focused ? <UserFocusIcon width={28} height={28} /> : <UserIcon width={26} height={26} />;
    default:
      return null;
  }
};

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
            height: 64,
            backgroundColor: "white",
            paddingHorizontal: 48,
            paddingVertical: 0,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            elevation: 10,
        },
        tabBarIcon: ({ color, focused }) => getTabBarIcon(route.name, focused),
        headerShown: false,
        tabBarShowLabel: false
      })}
    >
        <Tab.Screen name="BookMark" component={BookMarkScreen} options={{ tabBarLabel: '북마크' }} />
        <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: '홈' }} />
        
        <Tab.Screen name="MyPage" component={MyPageScreen} options={{ tabBarLabel: '마이페이지' }} />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
