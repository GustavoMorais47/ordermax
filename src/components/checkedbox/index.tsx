import { TouchableOpacity, Text} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
interface Props {
  disabled?: boolean;
  checked: boolean;
  setChecked: (value: boolean) => void;
  title: string;
}

export default function CheckedBox({
  disabled = false,
  checked,
  setChecked,
  title
}: Props) {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => setChecked(!checked)}
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 3,
        padding: 5,
      }}
    >
      <MaterialIcons
        name={checked ? "check-box" : "check-box-outline-blank"}
        size={20}
        color={disabled ? "rgba(0,0,0,0.2)" : "green"}
      />
      <Text>{title}</Text>
    </TouchableOpacity>
  );
}
