import { Button, View, Text } from "react-native";
import Header from "../../components/header";
import { useAuth } from "../../contexts/auth";

export default function Perfil() {
  const { setUsuario, usuario} = useAuth();
  return (
    <>
      <Header title="Perfil"
        goBack={usuario?.role === "mc"}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
          gap: 10,
        }}
      >
        <View>
          <Text
            style={{
              fontWeight: "bold",
              textTransform: "uppercase",
              textAlign: "center",
            }}
          >
            Atenção!
          </Text>
          <Text style={{ textAlign: "center" }}>
            Aplicativo de demonstração, não utilize dados reais. Algumas
            funcionalidades ainda não estão disponíveis ou estão em fase de testes. 
            Selecione o tipo de acesso para navegar de acordo com o perfil desejado
          </Text>
        </View>
        <Button title="Sem acesso" onPress={() => setUsuario(null)} />
        <Button
          title="Cliente"
          onPress={() => {
            setUsuario({
              _id: "6563af19089b3bd3690f79b6",
              concessionaria: null,
              pessoa: {
                _id: "1",
                nome: "teste",
                cpf: "12345678910",
                telefone: "12345678910",
                email: null,
              },
              role: "cl",
              status: true,
            });
          }}
        />
        <Button
          title="Consultor Técnico"
          onPress={() => {
            setUsuario({
              _id: "6563af19089b3bd3690f79b7",
              concessionaria: {
                _id: "1",
                nome: "teste",
                cnpj: "12345678910",
                telefone: "12345678910",
                email: null,
                endereco: {
                  cep: "12345678910",
                  rua: "teste",
                  numero: "12345678910",
                  bairro: "teste",
                  cidade: "teste",
                  UF: "GO",
                  coordenadas: null,
                },
                status: true,
              },
              pessoa: {
                _id: "1",
                nome: "teste",
                cpf: "12345678910",
                telefone: "12345678910",
                email: null,
              },
              role: "ct",
              status: true,
            });
          }}
        />
        <Button
          title="Mecânico"
          onPress={() => {
            setUsuario({
              _id: "6563af19089b3bd3690f79b8",
              concessionaria: {
                _id: "1",
                nome: "teste",
                cnpj: "12345678910",
                telefone: "12345678910",
                email: null,
                endereco: {
                  cep: "12345678910",
                  rua: "teste",
                  numero: "12345678910",
                  bairro: "teste",
                  cidade: "teste",
                  UF: "GO",
                  coordenadas: null,
                },
                status: true,
              },
              pessoa: {
                _id: "6563ae35163e58a87a9fe899",
                nome: "teste",
                cpf: "12345678910",
                telefone: "12345678910",
                email: null,
              },
              role: "mc",
              status: true,
            });
          }}
        />
      </View>
    </>
  );
}
