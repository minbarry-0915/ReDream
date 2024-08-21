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
        paddingVertical: 8,
    },
    dropDownMenuContainer:{
        justifyContent: 'center',
        alignItems: 'flex-start',
        borderBottomStartRadius: 12,
        borderBottomEndRadius: 12,
        paddingVertical: 12,
        paddingHorizontal: 24,
    }
})
export default CreateBookStyles;