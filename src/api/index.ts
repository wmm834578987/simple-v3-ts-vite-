/*
 * @Author: wmm834578987 53178191+wmm834578987@users.noreply.github.com
 * @Date: 2024-04-26 14:58:37
 * @LastEditors: 王明明834578987 10266004+wang-mingming-834578987@user.noreply.gitee.com
 * @LastEditTime: 2024-05-13 18:21:26
 * @FilePath: \imageManager\src\api\index.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import type { queryParam } from "../assets/type/common"
import { get, post } from "./http";
export default {
    getPicTags: (param: queryParam) => get("getPicTags", param),
}