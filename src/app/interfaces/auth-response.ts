export interface AuthResponse {
    user: {
        id: number,
        name: string,
        email: string,
        access_token: string,
        expires_in: number
    },
    errors:any
    auth_key : string
}

export interface GeneralResponse{
    status: boolean,
    data:any,
    errors: {}
}
