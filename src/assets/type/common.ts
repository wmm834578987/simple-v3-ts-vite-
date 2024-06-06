/*
 * @Author: wmm834578987 53178191+wmm834578987@users.noreply.github.com
 * @Date: 2024-04-26 17:52:53
 * @LastEditors: 王明明834578987 10266004+wang-mingming-834578987@user.noreply.gitee.com
 * @LastEditTime: 2024-05-13 18:21:34
 * @FilePath: \imageManager\src\assets\type\common.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export function isValidKey(key: string | number | symbol, object: object): key is keyof typeof object {
    return key in object;
}

export interface Result<T = any> {
    code: number | string;
    msg: string;
    data?: T;
}
export interface queryParam {
    id: string | number
}