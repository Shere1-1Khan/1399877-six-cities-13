import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { getToken } from './token';
import { AppRoute } from '../const';
import browserHistory from '../browser-history';
import { BACKEND_URL, REQUEST_TIMEOUT } from './api-сonstants';

type DetailMessageType = {
  type: string;
  message: string;
};

export const createAPI = (): AxiosInstance => {
  const api: AxiosInstance = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token: string | null = getToken();

    if (token !== null && config.headers) {
      config.headers['x-token'] = token;
    }

    return config;
  });

  api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<DetailMessageType>) => {
      const detailMessage: DetailMessageType | undefined = error.response?.data;

      if (detailMessage) {
        toast.warn(detailMessage.message);
      }

      if (error.response?.status === StatusCodes.NOT_FOUND) {
        browserHistory.push(AppRoute.NotFound);
      }

      throw error;
    }
  );

  return api;
};
