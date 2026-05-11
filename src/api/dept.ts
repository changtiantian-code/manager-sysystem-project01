import request from "@/utils/request"
import type { AddDeptType, EditDeptType, Dept } from "@/types/dept"
import type { Result } from "@/types/common"

// 编辑部门
export const addDept = (data: AddDeptType): Promise<Result> => request({
    url: "/depts",
    method: "post",
    data
})

// 获取部门列表
export const getDeptTable = (): Promise<Result<Dept[]>> => request({
    url: "/depts",
    method: "get"
})

// 删除部门
export const deleteDept = (id: number): Promise<Result> => request({
    url: `/depts?id=${id}`,
    method: "delete"
})

// 根据id获取部门
export const getDeptById = (id: number): Promise<Result<Dept>> => request({
    url: `/depts/${id}`,
    method: "get"
})

// 修改部门
export const editDept = (data: EditDeptType): Promise<Result> => request({
    url: '/depts',
    method: "put",
    data
})
