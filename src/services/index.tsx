import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
});

async function get<T>(
  path: "concessionaria/" | "cliente/" | "servico/" | "modelo/"
) {
  return new Promise<T>((resolve, reject) => {
    api
      .get(path)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function post<T>(path: "ordem/", obj: T, id?: string) {
  return new Promise<string>((resolve, reject) => {
    api
      .post(path, obj, {
        params: {
          id,
        },
      })
      .then((response) => {
        resolve(response.data.mensagem);
      })
      .catch((error) => {
        reject(error.response.data.mensagem);
      });
  });
}

async function put<T>(path: "ordem/status/" | "ordem/responsavel/" | "ordem/servicos/", obj: T, id: string) {
  return new Promise<string>((resolve, reject) => {
    api
      .put(path, obj, {
        params: {
          id,
        },
      })
      .then((response) => {
        resolve(response.data.mensagem);
      })
      .catch((error) => {
        reject(error.response.data.mensagem);
      });
  });
}

export default {
  get,
  post,
  put,
};
