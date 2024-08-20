import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import SignUpStyles from "../styles/signUpScreenStyle";
import GlobalStyles from "../styles/globalStyle";
import TopNavigator from "../components/topNavigator";
import SelectDropdown from "react-native-select-dropdown";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import loginStyles from "../styles/loginScreenStyle";
import { useSignUp } from "../contexts/signUpContext";

import EyeIcon from "../assets/icons/eye.svg";
import DropIcon from "../assets/icons/drop.svg";
import axios from "axios";

function SignUpScreen4({navigation}:{navigation: NavigationProp<ParamListBase>}){
    const {userData, setUserData} = useSignUp();
    const [birthDateInput, setBirthDateInput] = useState<string>(userData.birthDate);

    const onRegisterButton = async() => {
        console.log('SignUp: ', userData);
        setUserData(prevData => {
            const updatedUserData = { ...prevData, birthDate: birthDateInput };
            handleRegister(updatedUserData);  // 업데이트된 데이터를 인자로 전달
            return updatedUserData;
        });
    };

    const handleRegister = async(updatedUserData) =>{
        try{
            const response = await axios.post('http://192.168.0.2:3000/api/user/register', {
                    "id": updatedUserData.id,
                    "username": updatedUserData.name,
                    "password": updatedUserData.password,
                    "birthdate": updatedUserData.birthDate,
            },{
                headers:{
                    'Content-Type': 'application/json'
                },
                validateStatus: (status) => status < 500 
            });

            console.log(response);
            if(response.status === 201){
                console.log(response.data);
                navigation.navigate('SignUp5');
            }else if(response.status == 400){
                //이미 있는 아이디일때
                console.log('ID already exists');
            }else{
                throw new Error('Unexpected response status');
            }
        }catch (error) {
            console.error('Register failed:', error);
        }
    };

    const currentYear = new Date().getFullYear();
    const startYear = 1940;
    const endYear = currentYear;

    const isValidDate = (year, month, day) => {
        const date = new Date(year, month - 1, day); // month는 0부터 시작하므로 -1 필요
        return (
            date.getFullYear() === parseInt(year) &&
            date.getMonth() === month - 1 && // Date 객체의 month는 0부터 시작
            date.getDate() === parseInt(day)
        );
    };

    const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => (startYear + i).toString());
    const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
    const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());

    const monthNumber = new Date().getMonth() + 1; // 월은 0부터 시작하므로 1을 추가

    const [selectedYear, setSelectedYear] = useState<string>(currentYear.toString());
    const [selectedMonth, setSelectedMonth] = useState<string>(monthNumber.toString()); // 월은 1부터 시작
    const [selectedDay, setSelectedDay] = useState<string>(new Date().getDate().toString());

    useEffect(()=>{
        console.log(userData);
    },[])

    useEffect(() => {
        // 세 값이 모두 존재하고 유효한지 확인
        if (selectedYear && selectedMonth && selectedDay) {
            // 날짜 값이 유효한지 검사
            if (isValidDate(selectedYear, parseInt(selectedMonth), parseInt(selectedDay))) {
                console.log("ValidDate");
                setBirthDateInput(`${selectedYear}-${selectedMonth.padStart(2, '0')}-${selectedDay.padStart(2, '0')}`);
            } else {
                console.log("invalidDate");
                setBirthDateInput(''); // 유효하지 않은 경우 빈 문자열로 설정
            }
        }
    }, [selectedYear, selectedMonth, selectedDay]);

    return(
        <KeyboardAvoidingView 
        style={[GlobalStyles.container]}>
            <ScrollView 
            contentContainerStyle={{ 
                flex: 1,
                paddingHorizontal: 0,
                }} 
            keyboardDismissMode='interactive'
            keyboardShouldPersistTaps="handled">
                <TopNavigator navigation={navigation} title="회원가입"/>

                <View style={GlobalStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, {fontSize: 22}]}>
                        생년월일을 입력해주세요
                    </Text>
                </View>

                <View style={[GlobalStyles.content,{flexDirection: 'row', alignItems: 'center'}]}>
                    <SelectDropdown
                    data={years}
                    onSelect={(selectedYear, index) => {
                        console.log('Selected Year:', selectedYear, 'Index:', index);
                        setSelectedYear(selectedYear);
                    }}
                    defaultValue={selectedYear}
                    renderButton={(selectedYear, isYearOpened) => (
                        <View style={[SignUpStyles.content]}>
                            <View style={SignUpStyles.dropDownContainer}>
                                <Text style={SignUpStyles.dropDownText}>
                                    {selectedYear || currentYear}
                                </Text>
                                <TouchableOpacity>
                                    <DropIcon width={20} height={20}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                    renderItem={(item, index, isYearSelected) => (
                        <View>
                            <Text>{item}</Text>
                        </View>
                    )}
                    showsVerticalScrollIndicator={false}
                    dropdownStyle={SignUpStyles.dropDownMenuContainer}
                    />
                    <SelectDropdown
                        data={months}
                        onSelect={(selectedItem, index) => {
                        console.log('Selected Month:', selectedItem, 'Index:', index);
                        setSelectedMonth(selectedItem);
                        }}
                        defaultValue={selectedMonth}
                        renderButton={(selectedItem, isDropdownOpened) => (
                        <View style={[SignUpStyles.content]}>
                            <View style={SignUpStyles.dropDownContainer}>
                                <Text style={SignUpStyles.dropDownText}>
                                    {selectedItem || '1'}
                                </Text>
                                <TouchableOpacity>
                                    <DropIcon width={20} height={20}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )}
                        renderItem={(item, index, isYearSelected) => (
                            <View>
                                <Text>{item}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={SignUpStyles.dropDownMenuContainer}
                    />
                    <SelectDropdown
                        data={days}
                        onSelect={(selectedItem, index) => {
                        console.log('Selected Day:', selectedItem, 'Index:', index);
                        setSelectedDay(selectedItem);
                        }}
                        defaultValue={selectedDay}
                        renderButton={(selectedItem, isDropdownOpened) => (
                        <View style={[SignUpStyles.content,{marginRight: 0}]}>
                            <View style={SignUpStyles.dropDownContainer}>
                                <Text style={SignUpStyles.dropDownText}>
                                    {selectedItem || '1'}
                                </Text>
                                <TouchableOpacity>
                                    <DropIcon width={20} height={20}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        )}
                        renderItem={(item, index, isYearSelected) => (
                            <View>
                                <Text>{item}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={SignUpStyles.dropDownMenuContainer}
                    />
                </View>

                <View style={
                    [loginStyles.inputContainer, 
                    {flex: 1,
                    justifyContent:'flex-end',
                    paddingBottom: 48,
                    }
                ]}>
                    <TouchableOpacity 
                    onPress={onRegisterButton}
                    activeOpacity={0.7}
                    style={[loginStyles.loginButton]}>
                        <Text style={[GlobalStyles.semiBoldText,{color: 'white'}]}>
                            완료
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>   
        </KeyboardAvoidingView>
    )
}

export default SignUpScreen4;