export interface Result<T = any> {
    code: number;
    msg: string;
    data: T;
}

export interface PageResult<T = any> {
    total: number;
    rows: T[];
}
