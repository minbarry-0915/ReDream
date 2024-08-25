import { StyleSheet } from "react-native";
import BottomNaviatorContainer from "../components/bottomNavigator";

const GlobalStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        backgroundColor: 'white',   
    },
    content:{
        width: '100%',
        justifyContent: 'center',
        paddingHorizontal: 36,
        marginBottom: 36,
    },
    logoText: {
        fontFamily: 'ZenDots-Regular',
        color: 'black',
        fontSize: 32,
        letterSpacing: -1.0,
        justifyContent: 'center',
        
        textAlignVertical:'center',
    },
    mediumText:{
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    semiBoldText:{
        fontFamily: 'Pretendard-SemiBold',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    BoldText:{
        fontFamily: 'Pretendard-Bold',
        fontSize: 24,
        color: 'black',
        letterSpacing: -0.8,
        justifyContent: 'center',
        textAlignVertical:'center',
    },
    regularText:{
        fontFamily: 'Pretendard-Regular',
        fontSize: 13,
        color: 'black',
        letterSpacing: -0.8,
    },
    lightText:{
        fontFamily: 'Pretendard-Light',
        fontSize: 15,
        color: '#E93B3B',
        letterSpacing: -0.8,
    },
    iconContainer:{ 
        justifyContent: 'center',
        alignItems:'center',
    },
    topNavigatorContainer:{
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 24,
        paddingBottom: 24,
        paddingTop: 60,
        marginBottom: 22,
    },
    bottomNavigatorContainer:{
        width: '100%',
        justifyContent: 'center',
        alignItems:'center',
        backgroundColor: "white",
        paddingHorizontal: 10,
        paddingVertical: 12,
        flexDirection: 'row',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        elevation: 10,
    },
    bottomNavigatorContent:{
        justifyContent: 'center',
        alignItems:'center',
        width: 60,
        height: 60,
        marginRight: 32,
    },
    messegeModalContainer:{
        flex: 1,    
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // 30% 투명 검정색 배경
    },
    messegeModalContent:{
        width: 214,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 10,
        paddingHorizontal: 36,
        paddingVertical: 24,
    },
    messegeModalButtonsContainer:{
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 12
    },
    deleteConfirmbutton:{
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#D53838',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 12,
    },
})

export default GlobalStyles;