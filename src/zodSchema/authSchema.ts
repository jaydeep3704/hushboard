import { z } from "zod"

export const Username = z.string()
    .regex(/^[a-zA-Z][a-zA-Z0-9@#_]*$/, { message: 'Username must start with a letter and can contain letters, numbers, and @, #, _' }) // Ensure it starts with a letter and allows valid characters
    .regex(/^\S*$/, { message: 'Username must not contain spaces' }) // Ensure no spaces
    .min(3, { message: 'Username must be at least 3 characters long' })  // Optional: minimum length
    .max(20, { message: 'Username must be at most 20 characters long' }); // Optional: maximum length


const Email = z.string({ required_error: "Email is Required" }).email({ message: "Invalid email address" })

const Password = z.string({required_error:"Password is required"})
    .min(8, { message: "Password must be at least 8 characters long" })
    .regex(/[a-z]/, { message: "Password must include at least one lowercase letter" })
    .regex(/[A-Z]/, { message: "Password must include at least one uppercase letter" })
    .regex(/[0-9]/, { message: "Password must include at least one number" })
    .regex(/[^a-zA-Z0-9]/, { message: "Password must include at least one special character" })


const confirmPassword=z.string({required_error:"Password is required"})

export const SignupSchema=z.object({
    username:Username,
    email:Email,
    password:Password,
    confirmPassword:confirmPassword
}).refine((data)=>data.password===data.confirmPassword,{
    path:["confirmPassword"],
    message:"Passwords do not match"
})


export const SigninSchema=z.object({
    email:Email,
    password:Password
})


