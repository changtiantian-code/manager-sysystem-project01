import request from "@/utils/request"
import type { classType, Class } from "../types/class"
import type { Result, PageResult } from "@/types/common"

export const getTable = (params: classType): Promise<Result<PageResult<Class>>> => request({
    url: "/class",
    method: "get",
    params
})

export const deleteClassById = (id: number): Promise<Result> => request({
    url: `/class/${id}`,
    method: "delete"
})


export const addClass = (data: any): Promise<Result> => request({
    url: "/class",
    method: "post",
    data
}) 

export const getClassById = (id: number): Promise<Result<Class>> => request({
    url: `/class/${id}`,
    method: "get"
})


export const editClass = (data: any): Promise<Result> => request({
    url: "/class",
    method: "put",
    data
})

export const getClass = (name: string): Promise<Result<Class[]>> => request({
    url: `/class/clazz/${name}`,
    method: "get"
})