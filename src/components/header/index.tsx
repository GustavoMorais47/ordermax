import { useNavigation } from "@react-navigation/native";
import { ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useData } from "../../contexts/data";

const { width } = Dimensions.get("window");

export default function Header({
  title,
  subtitle,
  children,
  recoil = 15,
  goBack,
  disabledGoBack = false,
  profile,
  options,
  optionsTop
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  recoil?: number;
  goBack?: boolean;
  profile?: boolean;
  disabledGoBack?: boolean;
  options?: React.ReactNode;
  optionsTop?: React.ReactNode;
}) {
  const navigation = useNavigation();
  const { background } = useData();
  return (
    <>
      <ImageBackground
        source={
          !background
            ? require("../../../assets/background.jpg")
            : { uri: background }
        }
        style={{
          height: width * 0.5,
          elevation: 5,
        }}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.4)", "rgba(0,0,0,0.8)"]}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            paddingHorizontal: 20,
            paddingBottom: recoil,
          }}
        >
          {goBack && (
            <TouchableOpacity
              disabled={disabledGoBack}
              style={{
                position: "absolute",
                top: 45,
                left: 10,
                zIndex: 10,
                padding: 5,
                paddingHorizontal: 10,
                borderRadius: 50,
                backgroundColor: "rgba(0,0,0,0.6)",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 5,
              }}
              onPress={navigation.goBack}
            >
              <Ionicons
                name="arrow-back"
                size={16}
                color={disabledGoBack ? "#bbb" : "#fff"}
              />
              <Text
                style={{
                  color: disabledGoBack ? "#bbb" : "#fff",
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                Voltar
              </Text>
            </TouchableOpacity>
          )}
          {profile && (
            <TouchableOpacity
              disabled={disabledGoBack}
              style={{
                position: "absolute",
                top: 45,
                right: 10,
                zIndex: 10,
                padding: 10,
                borderRadius: 50,
                backgroundColor: "rgba(0,0,0,0.6)",
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => navigation.navigate("Perfil" as never)}
            >
              <Ionicons name="person" size={20} color="#fff" />
            </TouchableOpacity>
          )}
          {optionsTop && (
            <View
              style={{
                position: "absolute",
                top: 45,
                right: 10,
                zIndex: 10,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {optionsTop}
            </View>
          )}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <View style={{ gap: 3 }}>
              <Text
                style={{
                  color: "#fff",
                  fontSize: 20,
                  fontWeight: "bold",
                  textTransform: "capitalize",
                }}
              >
                {title}
              </Text>
              {subtitle && (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 12,
                    fontWeight: "300",
                  }}
                >
                  {subtitle}
                </Text>
              )}
            </View>
            {options && options}
          </View>
        </LinearGradient>
      </ImageBackground>
      {children}
    </>
  );
}
