import { TouchableOpacity, View, Text, Linking, Platform } from "react-native";
import Card from "../../components/card";
import { IConcessionaria } from "../../types/interfaces";
import { FontAwesome } from "@expo/vector-icons";
import mascaras from "../../utils/mascaras";

const plataforma = Platform.OS;

function ButtonOption({
  link,
  icon,
}: {
  link: string | null;
  icon: "phone" | "at" | "map-marker";
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

export default function Item({ item }: { item: IConcessionaria }) {
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
            {mascaras.cnpj(item.cnpj)}
          </Text>
          <Text
            style={{
              fontSize: 12,
              fontWeight: "300",
            }}
          >
            {item.endereco.rua}, {item.endereco.numero} - {item.endereco.bairro}{" "}
            - {item.endereco.cidade} - {item.endereco.UF}
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
          <ButtonOption
            link={
              item.endereco.coordenadas
                ? plataforma === "android"
                  ? `https://www.google.com/maps?q=${item.endereco.coordenadas.latitude},${item.endereco.coordenadas.longitude}(${item.nome})`
                  : plataforma === "ios"
                  ? `http://maps.apple.com/?ll=${item.endereco.coordenadas.latitude},${item.endereco.coordenadas.longitude}`
                  : null
                : null
            }
            icon="map-marker"
          />
        </View>
      </View>
    </Card>
  );
}
