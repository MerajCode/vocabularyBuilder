import { useColorScheme } from '@/hooks/useColorScheme.web';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, TouchableNativeFeedback, View } from 'react-native';
import { ThemedText } from '../ThemedText';

interface settingItem{
    title: string,
    icon: React.ReactNode,
    onPress?: () => void,
    link?:React.ReactNode,
    textColor?:string,
    comp?:React.ReactNode
}


const Item = ({title,icon,onPress=()=>0,link,textColor,comp}:settingItem) => {

  const isDarkMode = useColorScheme();

    return (
        <TouchableNativeFeedback onPress={()=>onPress()}>
          <View
            style={{
              flexDirection: "row",
              gap: 20,
              paddingHorizontal: 16,
              paddingVertical: 16,
              alignItems: "center",
              marginTop:6
            }}
          >
            {icon}
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <ThemedText
                style={{
                  fontFamily: "Inter-Medium",
                  fontSize: 14,
                }}
              >
                {title}
              </ThemedText>
              <View style={{flexDirection:"row",alignItems:"center",gap:5}}>
                {
                  comp?(
                    comp
                  ):("")
                }

              {
                link?(
                    link
                ):(
                    <MaterialIcons name="arrow-forward-ios" size={24} color={isDarkMode?"#fff":"#000"} />
                )
              }
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({});

export default Item;
