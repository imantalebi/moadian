import * as  jose from 'jose'
async function jweService(header, publicKey, payload){

    // if( ! (isset($header['alg']) && $header['alg'] == 'RSA-OAEP-256')){
    //     throw new \Exception('Cannot create JWE, the supported "alg" is (RSA-OAEP-256).');
    // }

    // if( ! (isset($header['enc']) && $header['enc'] == 'A256GCM')){
    //     throw new \Exception('Cannot create JWE, the supported "enc" is (A256GCM).');
    // }
//    const cek = crypto.randomBytes(32)
//    encryptedKey = crypto.publicEncrypt(publicKey,cek)

var key="-----BEGIN PUBLIC KEY-----"+"\n"+publicKey+"\n"+"-----END PUBLIC KEY-----"
const algorithm = 'ES256'
const spki = key
const ecPublicKey = await jose.importSPKI(spki, algorithm)
const jwe = await new jose.CompactEncrypt(
    new TextEncoder().encode(payload),
  )
    .setProtectedHeader(header)
    .encrypt(ecPublicKey)
//  console.log(jwe)
  return jwe
}

export default jweService