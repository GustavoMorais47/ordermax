import {
  ActivityIndicator,
  Button,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  Alert,
} from "react-native";
import Header from "../../components/header";
import Card from "../../components/card";
import { useData } from "../../contexts/data";
import { MultiSwitch } from "../../components/switch";
import { useState } from "react";
import { SelectList } from "react-native-dropdown-select-list";
import { Ionicons } from "@expo/vector-icons";
import Input from "../../components/input";
import services from "../../services";
import { useAuth } from "../../contexts/auth";
import { showMessage } from "react-native-flash-message";
import { useNavigation } from "@react-navigation/native";

export default function OrdemServicoCadastrar() {
  const { usuario } = useAuth();
  const navigation = useNavigation();
  const { servicos, clientes, modelos, getClientes, getServicos, getModelos } =
    useData();
  const [clienteSelecionado, setClienteSelecionado] = useState("");
  const [modeloSelecionado, setModeloSelecionado] = useState("");
  const [placa, setPlaca] = useState("");
  const [ano, setAno] = useState("");
  const [anoFabricacao, setAnoFabricacao] = useState("");
  const [cor, setCor] = useState("");
  const [servicosSelecionados, setServicosSelecionados] = useState<string[]>(
    []
  );
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingServicos, setLoadingServicos] = useState(false);
  const [loadingModelos, setLoadingModelos] = useState(false);
  const [loading, setLoading] = useState(false);

  const getLocalClientes = async () => {
    setLoadingClientes(true);
    getClientes().finally(() => {
      setClienteSelecionado("");
      setLoadingClientes(false);
    });
  };

  const getLocalServicos = async () => {
    setLoadingServicos(true);
    getServicos().finally(() => {
      setServicosSelecionados([]);
      setLoadingServicos(false);
    });
  };

  const getLocalModelos = async () => {
    setLoadingModelos(true);
    getModelos().finally(() => {
      setModeloSelecionado("");
      setLoadingModelos(false);
    });
  };

  const handleSave = async () => {
    if (
      clienteSelecionado === "" ||
      placa.trim() === "" ||
      modeloSelecionado === "" ||
      ano.trim() === "" ||
      anoFabricacao.trim() === "" ||
      cor === "" ||
      servicosSelecionados.length === 0
    )
      return showMessage({
        message: "Atenção!",
        description: "Todos os campos são de preenchimento obrigatório",
        type: "warning",
        icon: "warning",
      });

    const cliente = clientes.find((c) => c._id === clienteSelecionado);
    const modelo = modelos.find((m) => m._id === modeloSelecionado);

    if (!cliente || !modelo)
      return showMessage({
        message: "Atenção!",
        description: "Cliente ou modelo não encontrado",
        type: "warning",
        icon: "warning",
      });

    if (isNaN(Number(ano)))
      return showMessage({
        message: "Atenção!",
        description: "O ano modelo deve ser um número",
        type: "warning",
        icon: "warning",
      });

    if (isNaN(Number(anoFabricacao)))
      return showMessage({
        message: "Atenção!",
        description: "O ano de fabricação deve ser um número",
        type: "warning",
        icon: "warning",
      });

    if (ano.length !== 4)
      return showMessage({
        message: "Atenção!",
        description: "O ano modelo deve conter 4 dígitos",
        type: "warning",
        icon: "warning",
      });

    if (anoFabricacao.length !== 4)
      return showMessage({
        message: "Atenção!",
        description: "O ano de fabricação deve conter 4 dígitos",
        type: "warning",
        icon: "warning",
      });

    setLoading(true);
    await services
      .post<{
        id_modelo: string;
        id_cliente: string;
        placa: string;
        ano: string;
        ano_fabricacao: string;
        cor: string;
        servicos_solicitados: string[];
      }>(
        "ordem/",
        {
          id_cliente: cliente!._id,
          id_modelo: modelo!._id,
          ano,
          ano_fabricacao: anoFabricacao,
          placa,
          cor,
          servicos_solicitados: servicosSelecionados,
        },
        usuario?._id
      )
      .then((res) => {
        showMessage({
          message: "Sucesso!",
          description: res,
          type: "success",
          icon: "success",
        });
        navigation.goBack();
      })
      .catch((err) =>
        showMessage({
          message: "Erro!",
          description: err,
          type: "danger",
          icon: "danger",
        })
      )
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Header
        title="Cadastrar O.S"
        subtitle="Informe os dados da O.S"
        goBack
        disabledGoBack={loading}
        options={
          <TouchableOpacity
            disabled={loading}
            onPress={async () => {
              setLoading(true);
              await Promise.all([
                getLocalClientes(),
                getLocalModelos(),
                getLocalServicos(),
              ]).finally(() => setLoading(false));
            }}
          >
            <Ionicons
              name="refresh"
              size={30}
              color={loading ? "#aaa" : "#fff"}
            />
          </TouchableOpacity>
        }
      />
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 10,
          gap: 10,
        }}
      >
        <Card title="Cliente" subTitle="Selecione um cliente">
          {loadingClientes ? (
            <View>
              <ActivityIndicator size={"small"} />
            </View>
          ) : (
            <SelectList
              setSelected={setClienteSelecionado}
              placeholder="Selecione um cliente"
              searchPlaceholder="Pesquise por um cliente"
              data={clientes.map((c) => {
                return {
                  key: c._id,
                  value: c.nome,
                  disabled: loading,
                };
              })}
              save="key"
              notFoundText="Nenhum cliente encontrado"
              boxStyles={{
                borderWidth: 0.5,
              }}
              dropdownStyles={{
                borderWidth: 0.5,
              }}
            />
          )}
        </Card>
        <Card title="Veículo" subTitle="Infome os dados do veículo">
          {loadingModelos ? (
            <View>
              <ActivityIndicator size={"small"} />
            </View>
          ) : (
            <View style={{ gap: 10 }}>
              <Input
                text={placa}
                onChangeText={setPlaca}
                title="Placa"
                placeholder="Ex: abc0000"
              />
              <Text style={{ fontWeight: "bold" }}>Modelo</Text>
              <SelectList
                setSelected={setModeloSelecionado}
                placeholder="Selecione um modelo"
                searchPlaceholder="Pesquise por um modelo"
                data={modelos.map((m) => {
                  return {
                    key: m._id,
                    value: m.descricao,
                    disabled: loading ? loading : !m.status,
                  };
                })}
                save="key"
                notFoundText="Nenhum modelo encontrado"
                boxStyles={{
                  borderWidth: 0.5,
                }}
                dropdownStyles={{
                  borderWidth: 0.5,
                }}
              />
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <Input
                  text={ano}
                  onChangeText={(value) => setAno(value.replace(/[^0-9]/g, ""))}
                  title="Ano Modelo"
                  placeholder="Ex: 2023"
                  keyboardType="numeric"
                  maxLength={4}
                />
                <Input
                  text={anoFabricacao}
                  onChangeText={(value) =>
                    setAnoFabricacao(value.replace(/[^0-9]/g, ""))
                  }
                  title="Ano Fabricação"
                  placeholder="Ex: 2022"
                  keyboardType="numeric"
                  maxLength={4}
                />
              </View>
              <Text style={{ fontWeight: "bold" }}>Cor</Text>
              <SelectList
                setSelected={setCor}
                placeholder="Selecione uma cor"
                searchPlaceholder="Pesquise por uma cor"
                data={
                  modelos
                    .find((m) => m._id === modeloSelecionado)
                    ?.cores.map((c) => {
                      return {
                        key: c,
                        value: c,
                        disabled: loading,
                      };
                    }) || []
                }
                save="key"
                notFoundText="Nenhuma cor encontrada"
                boxStyles={{
                  borderWidth: 0.5,
                }}
                dropdownStyles={{
                  borderWidth: 0.5,
                }}
              />
            </View>
          )}
        </Card>
        <Card title="Serviços" subTitle="Selecione os serviços a serem feitos">
          {loadingServicos ? (
            <View>
              <ActivityIndicator size={"small"} />
            </View>
          ) : (
            <MultiSwitch
              disabled={loading}
              options={servicos.map((servico) => ({
                label: servico.descricao,
                value: servico._id,
              }))}
              selecteds={servicosSelecionados}
              setSelected={(value) => {
                if (servicosSelecionados.includes(value)) {
                  setServicosSelecionados(
                    servicosSelecionados.filter((servico) => servico !== value)
                  );
                } else {
                  setServicosSelecionados([...servicosSelecionados, value]);
                }
              }}
            />
          )}
        </Card>
        <Card>
          {loading ? (
            <View>
              <ActivityIndicator size={"small"} />
            </View>
          ) : (
            <Button title="Cadastrar" onPress={handleSave} />
          )}
        </Card>
      </ScrollView>
    </>
  );
}
