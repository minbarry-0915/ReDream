import { StyleSheet } from "react-native";

const CreateBookStyles = StyleSheet.create({
    content:{
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 24,
    },
    dropDownContainer:{
        //borderWidth: 1,
        width: '100%',
        flexDirection:'row',
        justifyContent: 'center',
        alignItems:'center',
    },
    dropDownText:{
        width: '93%',
        borderBottomWidth: 1,
        fontFamily: 'Pretendard-Medium',
        fontSize: 18,
        color: 'black',
        letterSpacing: -0.8,
        paddingHorizontal: 12,
        paddingVertical: 12,
    },
    dropDownMenuContainer:{
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomStartRadius: 12,
        borderBottomEndRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    },
    keyWordButton:{
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: '#EDEDED',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        elevation: 10,
        marginRight: 17,
        marginBottom: 12,
    },
    descriptionInputBox: {
        width: '100%',
        height: 250,
        borderRadius: 18,
        backgroundColor: '#F0F0F0',
        padding: 24,
        paddingBottom: 18,
        justifyContent: 'flex-start',
        textAlignVertical:'top',  // 텍스트를 상단에 맞춤
        alignItems: 'flex-start',
        overflow: 'hidden',  // 부모 영역을 넘치는 것을 숨김
        fontFamily: 'Pretendard-Light',
        fontSize: 16,
        letterSpacing: -1.0
    }
})
export default CreateBookStyles;