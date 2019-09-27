import axios from "axios";
import router from "@/router/index";

const instance = axios.create({
  baseURL: "/v1"
});

instance.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";

instance.interceptors.request.use(
  config => {
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
    return config;
  },
  error => Promise.error(error)
);

instance.interceptors.response.use(
  // 请求成功
  res => (res.status === 200 ? Promise.resolve(res) : Promise.reject(res)),
  // 请求失败
  error => {
    const { response } = error;
    if (response) {
      // 请求已发出，但是不在2xx的范围
      errorHandle(response.status, response.data.message);
      return Promise.reject(response);
    }
    return Promise.reject(error);
  }
);

const errorHandle = (code, msg) => {
  switch (code) {
    // 401: 未登录状态，跳转登录页
    case 401:
      toLogin();
      break;
    default:
  }
};

const errorCaptured = async asyncFunc => {
  try {
    const res = await asyncFunc();
    return [null, res];
  } catch (e) {
    return [e, null];
  }
};

const toLogin = () => {
  router.replace({
    path: "/login"
  });
};

const get = async (url, params) => {
  return await errorCaptured(instance.get(url, { params: params }));
};
const post = async params => {
  return await errorCaptured(instance.get(url, { params: params }));
};

export { get, post };
