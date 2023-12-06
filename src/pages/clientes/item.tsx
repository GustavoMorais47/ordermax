import { View, Text, TouchableOpacity, Linking } from "react-native";
import Card from "../../components/card";
import { IPessoa, IUsuario } from "../../types/interfaces";
import mascaras from "../../utils/mascaras";
import { FontAwesome } from "@expo/vector-icons";

interface IProps {
  item: IPessoa;
}

function ButtonOption({
  link,
  icon,
}: {
  link: string | null;
  icon: "phone" | "at";
}) {
  return (
    <TouchableOpacity
      disabled={!link}
      onPress={() => Linking.openURL(link!)}
      style={{
        backgroundColor: "rgba(0,0,0,0.05)",
        height: 30,
        width: 30,
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FontAwesome
        name={icon}
        size={18}
        color={link ? "black" : "rgba(0,0,0,0.2)"}
      />
    </TouchableOpacity>
  );
}

export default function Item({ item }: IProps) {
  return (
    <Card>
      <View
        style={{
          gap: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
            }}
          >
            {item.nome}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "300",
            }}
          >
            {mascaras.cpf(item.cpf)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 10,
          }}
        >
          <ButtonOption link={`tel:${item.telefone}`} icon="phone" />
          <ButtonOption
            link={item.email ? `mailto:${item.email}` : null}
            icon="at"
          />
        </View>
      </View>
    </Card>
  );
}
