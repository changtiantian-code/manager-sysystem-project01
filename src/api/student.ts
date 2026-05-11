import request from "@/utils/request"
import type { Student, StudentParamsType } from "@/types/student"
import type { Result, PageResult } from "@/types/common"

export const getStudentTable = (params: StudentParamsType): Promise<Result<PageResult<Student>>> => request({
    url: "/student",
    method: "get",
    params
})


export const deleteStudentById = (id: number): Promise<Result> => request({
    url: `/student/${id}`,
    method: "delete",
})

export const deleteStudentByIds = (ids: number[]): Promise<Result> => request({
    url: `/student/batch/${ids}`,
    method: "delete",
})

export const violationStudentById = (id: number): Promise<Result> => request({
    url: `/student/violation/${id}`,
    method: "put",
})

export const addStudent = (data: any): Promise<Result> => request({
    url: `/student`,
    method: "post",
    data
})

export const getStudentById = (id: number): Promise<Result<Student>> => request({
    url: `/student/${id}`,
    method: "get",
})

export const editStudent = (data: any): Promise<Result> => request({
    url: `/student`,
    method: "put",
    data
})