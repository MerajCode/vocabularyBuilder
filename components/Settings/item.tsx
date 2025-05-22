import { useColorScheme } from '@/hooks/useColorScheme.web';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { StyleSheet, Text, TouchableNativeFeedback, View } from 'react-native';

interface settingItem{
    title: string,
    icon: React.ReactNode,
    onPress?: () => void,
    link?:React.ReactNode,
    textColor?:string,
}


const Item = ({title,icon,onPress=()=>0,link,textColor}:settingItem) => {

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
              <Text
                style={{
                  color: "#fff",
                  fontFamily: "Inter-Medium",
                  fontSize: 16,
                }}
              >
                {title}
              </Text>
              {
                link?(
                    link
                ):(
                    <MaterialIcons name="arrow-forward-ios" size={24} color={isDarkMode?"#fff":"#000"} />
                )
              }
            </View>
          </View>
        </TouchableNativeFeedback>
    );
}

const styles = StyleSheet.create({})

export default Item;
