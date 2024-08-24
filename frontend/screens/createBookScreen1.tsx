import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, ScrollView, View, Text, TouchableOpacity } from "react-native";
import { NavigationProp, ParamListBase } from "@react-navigation/native";
import axios from "axios";
import SelectDropdown from "react-native-select-dropdown";

import GlobalStyles from "../styles/globalStyle";
import loginStyles from "../styles/loginScreenStyle";
import CreateBookStyles from "../styles/createBookScreenStyle";
import SignUpStyles from "../styles/signUpScreenStyle";

import TopNavigator from "../components/topNavigator";
import DropIcon from "../assets/icons/drop.svg";
import { useCreateBook } from "../contexts/createBookContext";


interface Genre {
    genre_id: number;
    genre_name: string;
}

function CreateBookScreen1({navigation}: {navigation: NavigationProp<ParamListBase>}) {
    const [genreInput, setGenreInput] = useState<Genre[]>([]);
    const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null); // 선택된 장르 상태
    const { bookData, setBookData } = useCreateBook();
    const [errorMessege, setErrorMessege] = useState(false);

    const onNextButton = () => {
        if(errorMessege !== true && selectedGenre !== null){
            setBookData(prevData => ({
                ...prevData,
                genre: selectedGenre.genre_name // genre_id를 설정
            }));
        }
        
    };

    useEffect(() => {
        if (bookData.genre) { // bookData.genre가 업데이트되면
            console.log(bookData);
            navigation.navigate("CreateBook2", {
                genreId: selectedGenre?.genre_id // genre_id를 파라미터로 넘기기
            });
        }
    }, [bookData.genre, selectedGenre, navigation]);


    const getGenre = async () => {
        try {
            const response = await axios.get("http://192.168.56.1:3000/api/genreList");
            setGenreInput(response.data.genres);
        } catch (error) {
            console.log("Fail to fetch Genres", error);
        }
    };

    useEffect(() => {
        getGenre();
    }, []);

    useEffect(() => {
      if(selectedGenre === null){
        setErrorMessege(true);
      }else{
        setErrorMessege(false);
      }
    }, [selectedGenre])
    
    return (
        <KeyboardAvoidingView style={[GlobalStyles.container]}>
            <ScrollView
                contentContainerStyle={{ 
                    flex: 1,
                    paddingHorizontal: 0,
                }} 
                keyboardDismissMode='interactive'
                keyboardShouldPersistTaps="handled"
            >
                <TopNavigator 
                navigation={navigation} 
                title="동화생성" 
                showBackButton={true}
                showTitle={true}
                />

                <View style={GlobalStyles.content}>
                    <Text style={[GlobalStyles.semiBoldText, { fontSize: 22 }]}>
                        동화의 장르를 선택해주세요
                    </Text>
                </View>
                
                <View style={GlobalStyles.content}>
                    <SelectDropdown
                        data={genreInput}
                        onSelect={(selectedItem, index) => {
                            setSelectedGenre(selectedItem);
                            console.log('Selected Genre: ', selectedItem);
                        }}
                        defaultValue={selectedGenre ? selectedGenre.genre_name : ''}
                        renderButton={(selectedItem, isDropdownOpened) => (
                            <View style={[SignUpStyles.content, { marginRight: 0 }]}>
                                <View style={CreateBookStyles.dropDownContainer}>
                                    <Text style={CreateBookStyles.dropDownText}>
                                        {selectedItem ? selectedItem.genre_name : "장르"}
                                    </Text>
                                    <TouchableOpacity>
                                        <DropIcon width={20} height={20}/>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        renderItem={(item, index, isGenreSelected) => (
                            <View key={index}>
                                <Text>{item.genre_name}</Text>
                            </View>
                        )}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={CreateBookStyles.dropDownMenuContainer}
                    />
                </View>

                {errorMessege? (
                    <View style={GlobalStyles.content}>
                        <Text style={GlobalStyles.lightText}>
                            장르를 선택해주세요
                        </Text>
                    </View>
                ): null}
                
                <View style={[
                    loginStyles.inputContainer,
                    {
                        flex: 1,
                        justifyContent: 'flex-end',
                        paddingBottom: 48,
                    }
                ]}>
                    <TouchableOpacity 
                        onPress={onNextButton}
                        activeOpacity={0.7}
                        style={[loginStyles.loginButton]}
                    >
                        <Text style={[GlobalStyles.semiBoldText, { color: 'white' }]}>
                            다음
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

export default CreateBookScreen1;
