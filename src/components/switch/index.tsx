import React, { useState } from "react";
import { TouchableOpacity, View, Text, ColorValue } from "react-native";

export interface IOption {
  label: string;
  value: string;
}

interface IPropsSwitch {
  options: IOption[];
  selected: string | null;
  setSelected: (value: string | null) => void;
  disabled?: boolean;
}

export function Switch({
  options,
  selected,
  setSelected,
  disabled = false,
}: IPropsSwitch) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
      }}
    >
      {options.length > 0 ? (
        options.map((option, index) => {
          return (
            <TouchableOpacity
              key={index}
              disabled={disabled ? disabled : selected === option.value}
              style={{
                flex: 1,
                backgroundColor:
                  selected === option.value ? "#000" : "rgba(0,0,0,0.02)",
                paddingHorizontal: 10,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                minWidth: "25%",
              }}
              onPress={() => {
                if (selected === option.value) {
                  setSelected(null);
                } else {
                  setSelected(option.value);
                }
              }}
            >
              <Text
                numberOfLines={2}
                style={{
                  color: selected === option.value ? "#fff" : "#000",
                  fontWeight: selected === option.value ? "bold" : "normal",
                  textAlign: "center",
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text
          style={{
            fontWeight: "300",
          }}
        >
          Não há opções
        </Text>
      )}
    </View>
  );
}

interface IPropsMultiSwitch {
  options: IOption[];
  selecteds: string[];
  setSelected: (value: string) => void;
  disabled?: boolean;
}
export function MultiSwitch({
  options,
  selecteds,
  setSelected,
  disabled = false,
}: IPropsMultiSwitch) {
  return (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 5,
      }}
    >
      {options.length > 0 ? (
        options.map((option, index) => {
          const selecionado = selecteds.includes(option.value);
          return (
            <TouchableOpacity
              key={index}
              style={{
                flex: 1,
                backgroundColor: selecionado ? "#000" : "rgba(0,0,0,0.02)",
                paddingHorizontal: 10,
                height: 40,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
                minWidth: "25%",
              }}
              disabled={disabled}
              onPress={() => {
                setSelected(option.value);
              }}
            >
              <Text
                style={{
                  color: disabled ? "#aaa" :  selecionado ? "#fff" : "#000",
                  fontWeight: selecionado ? "bold" : "normal",
                  textAlign: "center",
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })
      ) : (
        <Text
          style={{
            fontWeight: "300",
            textAlign: "center",
          }}
        >
          Não há opções
        </Text>
      )}
    </View>
  );
}
