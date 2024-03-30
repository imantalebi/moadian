import  * as jose from 'jose'
import * as crypto from 'crypto';


async function jwsService(privateKey, header, payload) {

  payload = jose.base64url.encode(JSON.stringify(payload))

  header = jose.base64url.encode(JSON.stringify(header))
  const data = header + "." + payload
  
  // const jwtSig = await new jose.CompactSign(
  //   new TextEncoder().encode(data),
  // )
  //   .setProtectedHeader({ alg: 'RS256' })
  //   .sign(privateKey)
  const msg = Buffer.from(`${header}.${payload}`);
   var jwtSig = await crypto.sign("sha256WithRSAEncryption", msg, privateKey)
  //  crypto.sign("RSA-SHA256", data, privateKey, function(error, signature) {
  //   if (error) {
  //       console.log(error)
  //       return;
  //   }else{
  //     console.log(JSON.stringify(signature))
  //   }
  // })
  // jwtSig=JSON.stringify(jwtSig)
  // console.log(jwtSig)
  
 
  const jws = data + "." + jose.base64url.encode(jwtSig);
  
       return jws
}
export default jwsService