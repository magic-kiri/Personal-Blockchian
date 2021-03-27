const crypto = require("crypto")
const NodeRSA = require('node-rsa')
var sha256 = require('js-sha256')
// const sshpk = require('sshpk');
const window = require("window")


class CryptoSecurity{
    constructor(){}
    getKey(pass){

        const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
                    modulusLength: 2048,    // options
                    publicExponent: 0x10101,
                    publicKeyEncoding: {type: 'spki',format: 'pem',passphrase:pass},
                    privateKeyEncoding: {type: 'pkcs8',format: 'pem', cipher: 'aes-192-cbc',passphrase: pass
                    }
              });
        return {privateKey, publicKey};
    }


    encryption(data,publicKey){
        const encryptedData = crypto.publicEncrypt(
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
            },
            // We convert the data string to a buffer using `Buffer.from`
            Buffer.from(data)
        )
        console.log("encypted data: ", encryptedData.toString("base64"))
        return encryptedData
    }
    decryption(encryptedData,privatekey,pass){
        const decryptedData = crypto.privateDecrypt(
            {
                key: privatekey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: "sha256",
                passphrase: pass
            },
            Buffer.from(encryptedData)
        )
        // The decrypted data is of the Buffer type, which we can convert to a
        // string to reveal the original data
        console.log("decrypted data: ", decryptedData.toString())
        return decryptedData
    }
    signing(verifiableData,privateKey)
    {
        // The signature method takes the data we want to sign, the
        // hashing algorithm, and the padding scheme, and generates
        // a signature in the form of bytes
        const signature = crypto.sign("sha256", Buffer.from(verifiableData), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
        })
        console.log(signature.toString("base64"))
        return signature
    }

    verify(signature,verifiableData,publicKey)
    {
        const isVerified = crypto.verify("sha256", Buffer.from(verifiableData),
            {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            signature
        )
        console.log("signature verified: ", isVerified)
        return isVerified
    }
    
    symmetricEncryption(text,password) {
        let key = crypto.scryptSync(password, 'salt', 24)
        const iv = crypto.randomBytes(16)
        let cipher = crypto.createCipheriv('aes-192-cbc', key, iv)
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    }
    
    symmetricDecryption(text,password) {
        let key = crypto.scryptSync(password, 'salt', 24)
        let textParts = text.split(':');
        let iv = Buffer.from(textParts.shift(), 'hex');
        let encryptedText = Buffer.from(textParts.join(':'), 'hex');
        let decipher = crypto.createDecipheriv('aes-192-cbc', key, iv)
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted;
    }
    

}


module.exports = {CryptoSecurity}
