import request from '@/utils/request';
import type { LoginType } from "@/types/login";
import type { Result } from "@/types/common";

export const editPassword = (data: any): Promise<Result> => request({
    url: "/login/editPassword",
    method: "put",
    data
})
export const login = (data: LoginType): Promise<Result> => request({
    url: "/login",
    method: "post",
    data
})
