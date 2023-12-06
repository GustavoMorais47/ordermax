import { useEffect, useState } from "react";
import Header from "../../components/header";
import { useData } from "../../contexts/data";
import { IPessoa, IUsuario } from "../../types/interfaces";
import {
  Dimensions,
  FlatList,
  View,
  Text,
  ActivityIndicator,
} from "react-native";
import Card from "../../components/card";
import Input from "../../components/input";
import Item from "./item";

const { width } = Dimensions.get("window");

const renderItem = ({ item }: { item: IPessoa }) => <Item item={item} />;

export default function Clientes() {
  const { clientes, getClientes } = useData();
  const [clientesFiltrados, setClientesFiltrados] =
    useState<IPessoa[]>(clientes);
  const [pesquisa, setPesquisa] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePesquisa = () => {
    if (pesquisa.trim() === "") {
      setClientesFiltrados(clientes);
      return;
    }

    setClientesFiltrados(
      clientes.filter(
        (cliente) =>
          cliente.nome.toLowerCase().includes(pesquisa.toLowerCase()) ||
          cliente.cpf.toLowerCase().includes(pesquisa.toLowerCase())
      )
    );
  };

  useEffect(handlePesquisa, [clientes, pesquisa]);
  return (
    <>
      <Header
        title="Clientes"
        subtitle={
          clientesFiltrados.length > 1
            ? `Foram encontradas ${clientesFiltrados.length} clientes`
            : clientesFiltrados.length === 1
            ? `Foi encontrado 1 cliente`
            : undefined
        }
        recoil={width * 0.09}
      >
        <Card
          style={{
            marginTop: -width * 0.07,
            marginHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 5,
            }}
          >
            <Input
              text={pesquisa}
              onChangeText={setPesquisa}
              placeholder="Pesquise pelo nome ou CPF"
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      </Header>
      {!loading ? (
        <FlatList
          data={clientesFiltrados.sort((a, b) => a.nome.localeCompare(b.nome))}
          keyExtractor={(cliente) => cliente._id.toString()}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10,
          }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          renderItem={renderItem}
          ListEmptyComponent={() => (
            <Text
              style={{
                textAlign: "center",
                fontSize: 18,
                fontWeight: "bold",
                color: "#bbb",
                maxWidth: "80%",
                alignSelf: "center",
                marginTop: 20,
              }}
            >
              Nenhum cliente encontrado
            </Text>
          )}
          style={{
            marginTop: 10,
          }}
          refreshing={false}
          onRefresh={() => {
            setLoading(true);
            getClientes().finally(() => setLoading(false));
          }}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
}
