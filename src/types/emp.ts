export interface Emp {
    id: number
    username: string
    name: string
    gender: number
    image: string
    job: number
    entryDate: string
    deptId: number
    updateTime: string
    deptName?: string
    empExprList?: any[]
}

export interface empParamsType {
    name?: string
    gender?: number
    begin?: string
    end?: string
    page: number
    pageSize: number
}
