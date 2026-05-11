export interface LoginType {
    username: string;
    password: string;
}

export interface UserInfo {
    id: number;
    username: string;
    name: string;
    token: string;
    image?: string;
}