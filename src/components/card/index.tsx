import { View, Text, ColorValue, StyleProp, ViewStyle } from "react-native";

interface Props {
  title?: string;
  subTitle?: string;
  children?: React.ReactNode;
  iconRight?: React.ReactNode;
  backgroundColor?: ColorValue;
  style?: StyleProp<ViewStyle>;
}

export default function Card({
  title,
  subTitle,
  children,
  iconRight,
  backgroundColor,
  style,
}: Props) {
  return (
    <View
      style={[
        {
          gap: 5,
        },
        style,
      ]}
    >
      {(title || subTitle || iconRight) && (
        <View
          style={{
            gap: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {(title || subTitle) && (
            <View style={{ gap: 3 }}>
              {title && (
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 16,
                    fontWeight: "bold",
                  }}
                >
                  {title}
                </Text>
              )}
              {subTitle && (
                <Text
                  numberOfLines={2}
                  style={{
                    fontSize: 12,
                    fontWeight: "300",
                  }}
                >
                  {subTitle}
                </Text>
              )}
            </View>
          )}
          {iconRight && (
            <View
              style={{
                maxWidth: 40,
                maxHeight: 40,
                borderRadius: 10,
                overflow: "hidden",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {iconRight}
            </View>
          )}
        </View>
      )}
      <View
        style={{
          overflow: "hidden",
          borderRadius: 10,
          backgroundColor: backgroundColor || "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <View
          style={{
            flex: 1,
            padding: 10,
          }}
        >
          {children}
        </View>
      </View>
    </View>
  );
}