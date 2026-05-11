import request from "@/utils/request"
import type { empParamsType, Emp } from "@/types/emp"
import type { Result, PageResult } from "@/types/common"


export const getEmpTable = (params: empParamsType): Promise<Result<PageResult<Emp>>> => request({
    url: "/emps",
    method: "get",
    params
})

export const deleteById = (id: number): Promise<Result> => request({
    url: `/emps?id=${id}`,
    method: "delete"
})

export const deleteByIds = (ids: string): Promise<Result> => request({
    url: `/emps/batch?ids=${ids}`,
    method: "delete"
})

export const addEmp = (data: any): Promise<Result> => request({
    url: "/emps",
    method: "post",
    data
})

export const getEmp = (id: number): Promise<Result<Emp>> => request({
    url: `/emps/${id}`,
    method: "get"
})

export const editEmp = (data: any): Promise<Result> => request({
    url: "/emps",
    method: "put",
    data
})

export const getMaster = (): Promise<Result<{ label: string, value: number }[]>> => request({
    url: "/emps/master",
    method: "get"
})