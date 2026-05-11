export interface Class {
    id: number
    name: string
    classroom: string
    teacherName: string
    begin: string
    end: string
    status: number
    lastOperateTime: string
    subject: number
}

export interface classType {
    name?: string
    begin?: string
    end?: string
    page: number
    pageSize: number
}
