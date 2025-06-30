
export function generateOTP():string{
    return Math.floor(100000+900000*Math.random()).toString()
}