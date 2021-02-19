export interface User {
        id: number,
        // for login
        firstname:string,
        lastname:string,
        email: string,
        password: string,
        role?:number,
        // response
        full_name: string,
        usercode: string,
        status: number,
        created_at: number,
        updated_at: number,
        logged_at: number,
        picture_url: string,
        user_settings: any,
        userRole?:number, // 1 for regular User, 2 for Restaurant Owner
}
