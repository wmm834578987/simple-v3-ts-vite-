import { UploadRawFile } from "element-plus";

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
    page?: number
    limit?: number
    preschool?: string
    userName?: string
    isCorrect?: string | number
    userId?: string | number
    file?: UploadRawFile
    id?: number | string
}

export interface TableColumn {
    preschool: string;
    userName: string;
    profilePic: string;
    index?: number;
    has: string | number | boolean;
    isCorrect: number | string;
    id: number | string
}

export interface TableDataCloumn {
    lecture: string;
    homework: string | number;
    manifestation: string | number;
    ability: string | number;
}

export enum MARK {
    homework = 'homework',
    manifestation = 'manifestation',
    ability = 'ability',
}

export interface ListResult {
    id?: number;
    createTime?: null | string;
    updateTime?: string;
    preschool: string;
    userName?: string;
    lectureName?: string;
    score1?: number;
    score2?: number;
    score3?: number;
    isDeleted?: number;
    lecture?: string;
    homework?: number;
    manifestation?: number;
    ability?: number;
    point?: string;
    errorPoint?: string;
    index?: number
}


export interface RadarOption {
    ability: string
    userScore: number
    totalScore: number
}

