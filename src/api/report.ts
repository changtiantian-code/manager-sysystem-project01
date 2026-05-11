import request from "@/utils/request"
import type { Result } from "@/types/common"
import type { ReportItem, JobReport } from "@/types/report"

export const getEmpJob = (): Promise<Result<JobReport>> => request({
    url: "/report/job",
    method: "get",
})

export const getEmpGender = (): Promise<Result<ReportItem[]>> => request({
    url: "/report/gender",
    method: "get",
})

export const getClassNum = (): Promise<Result<ReportItem[]>> => request({
    url: "/report/classNum",
    method: "get",
})

export const getStuDregee = (): Promise<Result<ReportItem[]>> => request({
    url: "/report/stuDregee",
    method: "get",
})