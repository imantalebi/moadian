import jwsService from "./services/jws"
import { v4 as uuidv4 } from 'uuid';
import sendRequest from "./services/sendRequest"
import * as moment from 'moment';
import jweService from "./services/jwe";
import * as cdigit from "cdigit"


export class moadian {
    clientId
    privateKey
    certificate
    apiBaseUrl = "https://tp.tax.gov.ir/requestsmanager/api/v2"
    constructor(clientId, privateKey, certificate, sandbox = false) {
        this.clientId = clientId,
            this.privateKey = privateKey,
            this.certificate = this.cerReplace(certificate)


        if (sandbox) {
            this.apiBaseUrl = "https://sandboxrc.tax.gov.ir/requestsmanager/api/v2"
        }
    }


    requestNonce() {
        return sendRequest(this.apiBaseUrl + '/nonce?timeToLive=' + Math.floor(Math.random() * 180 + 20))

    }
    async requestToken() {

        var nonce = await this.requestNonce()
        // moment().toISOString()
        // moment().format('Y-m-d')+'T'+moment().format('H:m:s')+'Z'
        var jwsHeader = {
            alg: 'RS256',
            typ: 'jose',
            x5c: [this.certificate.trim()],
            sigT: moment().toISOString(),
            crit: ['sigT'],
            cty: 'text/plain',
        }
        var data = {
            'nonce': nonce['nonce'],
            'clientId': this.clientId
        }

        var token = await jwsService(this.privateKey, jwsHeader, data)

        return token
    }

    async getServerInformation() {
        var token = await this.requestToken()

        const res = await sendRequest(this.apiBaseUrl + '/server-information', 'GET', token);
        return res
    }

    async sendInvoice(invoicesPackets) {

        var token = await this.requestToken();

        const result = await sendRequest(this.apiBaseUrl + '/invoice', 'POST', token, invoicesPackets);

        return result;
    }

    async createInvoicePacket(invoiceHeader, invoiceBody, invoicePayment = []) {

        var token = await this.getServerInformation();
        const serverPublicKey = token['publicKeys'][0]['key']
        const serverPublicKeyId = token['publicKeys'][0]['id']
        var jwsHeader = {
            alg: 'RS256',
            typ: 'jose',
            x5c: [this.certificate.trim()],
            sigT: moment().toISOString(),
            crit: ['sigT'],
            cty: 'text/plain',
        }
        const invoiceJWS = await jwsService(this.privateKey, jwsHeader, { 'header': invoiceHeader, 'body': invoiceBody, 'payments': invoicePayment })
        const jweHeader = {
            'alg': 'RSA-OAEP-256',
            'enc': 'A256GCM',
            'kid': serverPublicKeyId,
        };
        var payload = await jweService(jweHeader, serverPublicKey, invoiceJWS)
        var data = {
            'payload': payload,
            'header': {
                'requestTraceId': uuidv4(),
                'fiscalId': this.clientId,
            },
        };

        return data
    }
    CHARACTER_TO_NUMBER_CODING = {
        'A': 65,
        'B': 66,
        'C': 67,
        'D': 68,
        'E': 69,
        'F': 70,
        'G': 71,
        'H': 72,
        'I': 73,
        'J': 74,
        'K': 75,
        'L': 76,
        'M': 77,
        'N': 78,
        'O': 79,
        'P': 80,
        'Q': 81,
        'R': 82,
        'S': 83,
        'T': 84,
        'U': 85,
        'V': 86,
        'W': 87,
        'X': 88,
        'Y': 89,
        'Z': 90,
        '0': 0,
        '1': 1,
        '2': 2,
        '3': 3,
        '4': 4,
        '5': 5,
        '6': 6,
        '7': 7,
        '8': 8,
        '9': 9,
    };
    generateInvoiceId(date, internalInvoiceId) {
        var daysPastEpoch = this.getDaysPastEpoch(date);

        var daysPastEpochPadded = daysPastEpoch.toString().padStart(6, '0');
        var hexDaysPastEpochPadded = this.dechex(daysPastEpoch).toString().padStart(5, '0');
        var numericClientId = this.clientIdToNumber();

        var internalInvoiceIdPadded = internalInvoiceId.toString().padStart(12, '0');
        var hexInternalInvoiceIdPadded = this.dechex(internalInvoiceId).toString().padStart(10, '0');

        var decimalInvoiceId = numericClientId + daysPastEpochPadded + internalInvoiceIdPadded;

        var checksum =  cdigit.verhoeff.compute(decimalInvoiceId); 
        
        return (this.clientId + hexDaysPastEpochPadded + hexInternalInvoiceIdPadded + checksum).toUpperCase();
    }
    generateInno(internalInvoiceId) {
        return this.dechex(internalInvoiceId).toString().padStart(10, '0');
    }
    getDaysPastEpoch(date) {

        return Math.round(date / (3600 * 24))

    }


    is_Numeric(s: number) {
        if (typeof s != 'string') {
            return false;
        }

        return !isNaN(s) && !isNaN(parseFloat(s));
    }
    clientIdToNumber() {

        var result = '';

        this.clientId.split('').forEach(char => {
            if (this.is_Numeric(char)) {
                result += char;
            } else {
                result += this.CHARACTER_TO_NUMBER_CODING[char];
            }
        });

        return result;
    }
    dechex(number) {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }

        return number.toString(16).toUpperCase();
    }

    async inquiryByUId(UIds, startDateTime = '', endDateTime = '') {

        const token = await this.requestToken();

        var params = 'fiscalId=' + this.clientId;


        params += '&uidList=' + UIds;




        var result = sendRequest(this.apiBaseUrl + '/inquiry-by-uid?' + params, 'GET', token);

        return result;
    }
    cerReplace(cer) {
        let certificate = cer.replace("-----BEGIN CERTIFICATE-----", "")
        certificate = certificate.replace("-----END CERTIFICATE-----", "")
        return certificate.trim()
    }
}


