import * as crypto from "node:crypto";
import {number} from "zod";


export function generateOTP() {
    return crypto.randomInt(1000,9999)
}

export function generateOTPHash(otp:number) {
    return crypto.createHash("sha256").update(otp.toString()).digest("hex")
}
export function validateOTPHash(otp:number, hash:string):boolean {
    const computedHash = generateOTPHash(otp)
    console.log("computed hash",computedHash)
    console.log("original hash",hash)
    const a = Buffer.from(computedHash,"hex")
    const b = Buffer.from(hash,"hex")
    return crypto.timingSafeEqual(a,b)
}