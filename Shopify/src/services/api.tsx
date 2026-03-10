import axios from "axios";
import { jwtDecode, type JwtPayload } from "jwt-decode";

const api = axios.create({
  baseURL: "http://localhost/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const getCurrentUserId = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;
  try {
    type DecodedAccessToken = JwtPayload & { user_id?: string; sub?: string };
    const decoded = jwtDecode<DecodedAccessToken>(token);
    return decoded.user_id ?? decoded.sub ?? null;
  } catch (error) {
    return null;
  }
};

api.interceptors.request.use(async(config) => {
  
 const accessToken = localStorage.getItem("access");
  
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  
  return config;
});

api.interceptors.response.use((response)=>response,async(error)=>{
   const refreshToken = localStorage.getItem("refresh");
   const originalRequest = error.config;
  if (error.response.status===401 &&  refreshToken && !originalRequest._retry){
   
     originalRequest._retry = true;
    try {
      const res = await axios.post("http://localhost:8000/api/user/token/refresh/", {
        refresh: refreshToken,
      });
      const accessToken = res.data.access;
      if (accessToken) {
    localStorage.setItem("access", accessToken);
    if (accessToken) {
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  }
  return api(originalRequest);
    
     }
    } catch (err) {
      localStorage.clear();
      if (err instanceof Error) {
          console.log(err.message);
       } else {
          console.log(err);
        }
    }
  

  }
  return Promise.reject(error)
})



export default api;
