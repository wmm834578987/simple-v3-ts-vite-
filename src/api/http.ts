/*
 * @Author: 王明明834578987 10266004+wang-mingming-834578987@user.noreply.gitee.com
 * @Date: 2024-04-26 14:58:29
 * @LastEditors: 王明明834578987 10266004+wang-mingming-834578987@user.noreply.gitee.com
 * @LastEditTime: 2024-05-20 18:28:14
 * @FilePath: \imageManager\src\api\http.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios, {
    AxiosResponse,
} from "axios";
import { Result } from "../assets/type/common";
// 测试环境和生产环境互换
const { MODE } = import.meta.env
let env = MODE === 'production' ? "newKejian-pro" : "newKejian-test"
const request = axios.create({
    baseURL: `/${env}` //import.meta.env.MODE === 'production' ? env : `/api/${env}`
})

// http request拦截器
request.interceptors.request.use(
    (config) => {
        let token = localStorage.getItem('token');//此处用这个localStorage 也可以用store，因为一般登录后都会将登录信息存储到vuex中，但是如果不存储到localsStorage的话，当前页面刷新时，vuex中的内容会消失。
        if (token) {
            config.headers.authorization = token //请求头加上token
            config.headers.token = token
        }
        return config
    }, err => {
        return Promise.reject(err);
    }
)

request.interceptors.response.use(
    (response: AxiosResponse<any>) => {
        //拦截响应，做统一处理
        if (response.data.code) {
            switch (response.data.code) {
                // case 1002:
                // store.state.isLogin = false;//store中有个isLogin表示登录状态，这个视具体情况而定
                // router.replace({
                // 	path:'login',
                // 	query:{
                // 		redirect:router.currentRoute.fullPath	
                // 	}
                // })	
            }
        }
        return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
        return Promise.reject(error?.response?.status);//接口返回的错误信息
    }
)

export function get(url: string, params: any) {
    return new Promise((resolve, reject) => {
        request.get(url, { params: params }).then((res: AxiosResponse<Result>) => {
            resolve(res.data as Result)
        }).catch(err => {
            reject(err)
        })
    })
}


export function post(url: string, params: any, config: any = { "Content-Type": "application/json;charset=utf-8" }) {
    return new Promise((resolve, reject) => {
        request.post(url, params, config).then((res: AxiosResponse<Result>) => {
            resolve(res.data as Result)
        }).catch(err => {
            reject(err)
        })
    })
}

