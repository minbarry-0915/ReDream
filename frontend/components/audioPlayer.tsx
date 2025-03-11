import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import Sound from 'react-native-sound';
import MicIcon from '../assets/icons/mic.svg';
import MicOffIcon from '../assets/icons/micOff.svg';
import {TouchableOpacity} from 'react-native';

const AudioPlayer = ({uri}) => {
  const [sound, setSound] = useState<Sound | null>(null); // Sound 타입 또는 null
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!uri) {
      return;
    } // URI가 없으면 초기화하지 않음

    // Sound 객체 초기화
    const newSound = new Sound(uri, undefined, error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
    });

    // 상태에 Sound 객체 저장
    setSound(newSound);

    // 컴포넌트 언마운트 시 Sound 객체 해제
    return () => {
      newSound.release();
    };
  }, [uri]);

  const playPauseAudio = () => {
    if (sound) {
      if (isPlaying) {
        sound.stop();
        setIsPlaying(false);
      } else {
        sound.setVolume(0.3).play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false); // 재생 완료 후 상태 초기화
        });
        setIsPlaying(true);
      }
    }
  };

  return (
    <View>
      {isPlaying ? (
        <TouchableOpacity activeOpacity={0.7} onPress={playPauseAudio}>
          <MicIcon width={40} height={40} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity activeOpacity={0.7} onPress={playPauseAudio}>
          <MicOffIcon width={40} height={40} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default AudioPlayer;
