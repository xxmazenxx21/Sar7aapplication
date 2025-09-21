import CryptoJS from "crypto-js";


export const encrypt = (plaintext)=>{

return  CryptoJS.AES.encrypt(plaintext, process.env.ENCRYPTION_KEY).toString();

}



export const decrypt = (ciphertext)=>{

return CryptoJS.AES.decrypt(ciphertext, process.env.ENCRYPTION_KEY).toString(
    CryptoJS.enc.Utf8
);

}
