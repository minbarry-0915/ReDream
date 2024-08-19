import { StyleSheet } from "react-native";

const loginStyles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    logoContainer:{
        width: '100%',
        paddingHorizontal: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 132,
    },
    inputContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 48,
        marginBottom: 12,
    },
    inputContent: {
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor: '#636363',
        fontFamily: 'Pretendard-Medium',
        fontSize: 16,
        color: 'white',
        letterSpacing: -1.0
    },
    loginButton: {
        width: '100%',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 10,
        backgroundColor:'#3253FF',
        elevation: 10,
    },
    loginErrorContainer:{
        width: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 60,
        marginBottom: 12,
        //borderWidth: 2,
    },
    optionContainer:{
        flexDirection:'row',
        width: '100%',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingHorizontal: 48,
    },
    optionContent:{
        justifyContent:'center',
        alignItems:'center',
        padding: 10,
    }
})

export default loginStyles;