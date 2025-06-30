import crypto from "crypto"

export function hashPassword(password: string, salt: string) {

    return new Promise((resolve, reject) => {
        crypto.scrypt(password.normalize(), salt, 64, (error, hash) => {
            if(error) {
                reject(error)
            }
            else{
                resolve(hash.toString("hex").normalize())
            }
        })
    })
}

export function generateSalt(){
    return crypto.randomBytes(16).toString("hex").normalize()
}

export async function comparePasswords({hashedPassword,salt,password}:{hashedPassword:string,salt:string,password:string}){
    const inputHashedPassword=await hashPassword(password,salt)
    
    return crypto.timingSafeEqual(
        Buffer.from(inputHashedPassword as string,"hex"),
        Buffer.from(hashedPassword,"hex")
    )
}