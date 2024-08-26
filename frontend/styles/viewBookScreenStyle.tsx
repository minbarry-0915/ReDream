import { Dimensions, StyleSheet } from "react-native";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const ViewBookStyles = StyleSheet.create({
    imageContainer:{
        width: screenWidth,
        height: screenHeight,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명한 검정색 배경
    },
    titleContainer:{
        position: 'absolute',
        bottom: 100,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 24,
    },
    carouselContainer:{
        flex: 1,
        justifyContent: 'center'
    },
    carouselItem:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }

});

export default ViewBookStyles;