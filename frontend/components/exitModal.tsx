import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import GlobalStyles from "../styles/globalStyle";
import { NavigationProp, ParamListBase } from "@react-navigation/native";

interface ModalProp {
    navigation: NavigationProp<ParamListBase>;
    modalVisible: boolean;
    onClose: () => void; // 모달을 닫는 함수
}

function ExitModal(props: ModalProp) {
    const { navigation, modalVisible, onClose } = props;

    const confirmExit = () => {
        navigation.navigate('Home');
    };

    return (
        <Modal
            transparent={true}
            animationType="fade"
            visible={modalVisible}
            onRequestClose={onClose} // 모달 닫기
        >
            <View style={GlobalStyles.messegeModalContainer}>
                <View style={GlobalStyles.messegeModalContent}>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 16 }]}>동화를 종료할까요?</Text>
                    <View style={GlobalStyles.messegeModalButtonsContainer}>
                        <TouchableOpacity
                            style={GlobalStyles.deleteConfirmbutton}
                            activeOpacity={0.7}
                            onPress={confirmExit}
                        >
                            <Text style={[GlobalStyles.BoldText, { width: 41, textAlign: 'center', fontSize: 16, color: 'white' }]}>네</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[GlobalStyles.deleteConfirmbutton, { backgroundColor: 'white', borderWidth: 1 }]}
                            activeOpacity={0.7}
                            onPress={onClose} // 모달 닫기
                        >
                            <Text style={[GlobalStyles.BoldText, { width: 41, textAlign: 'center', fontSize: 16, color: 'black' }]}>아니오</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default ExitModal;
