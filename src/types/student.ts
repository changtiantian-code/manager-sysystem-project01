export interface Student {
    id: number
    name: string
    no: string
    clazzId: number
    clazzName: string
    gender: number
    phone: string
    degree: number
    violationCount: number
    violationScore: number
    updateTime: string
}

export interface StudentParamsType {
    name?: string
    degree?: number
    clazzId?: number
    page: number
    pageSize: number
}
