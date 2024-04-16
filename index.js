"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.moadian = void 0;
var jws_1 = require("./services/jws");
var uuid_1 = require("uuid");
var sendRequest_1 = require("./services/sendRequest");
var moment = require("moment");
var verhoeff_1 = require("./services/verhoeff");
var jwe_1 = require("./services/jwe");
var moadian = /** @class */ (function () {
    function moadian(clientId, privateKey, certificate, sandbox) {
        if (sandbox === void 0) { sandbox = false; }
        this.apiBaseUrl = "https://tp.tax.gov.ir/requestsmanager/api/v2";
        this.CHARACTER_TO_NUMBER_CODING = {
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
        this.clientId = clientId,
            this.privateKey = privateKey,
            this.certificate = this.cerReplace(certificate);
        if (sandbox) {
            this.apiBaseUrl = "https://sandboxrc.tax.gov.ir/requestsmanager/api/v2";
        }
    }
    moadian.prototype.requestNonce = function () {
        return (0, sendRequest_1.default)(this.apiBaseUrl + '/nonce?timeToLive=' + Math.floor(Math.random() * 180 + 20));
    };
    moadian.prototype.requestToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var nonce, jwsHeader, data, token;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestNonce()
                        // moment().toISOString()
                        // moment().format('Y-m-d')+'T'+moment().format('H:m:s')+'Z'
                    ];
                    case 1:
                        nonce = _a.sent();
                        jwsHeader = {
                            alg: 'RS256',
                            typ: 'jose',
                            x5c: [this.certificate.trim()],
                            sigT: moment().format('Y-m-d') + 'T' + moment().format('H:m:s') + 'Z',
                            crit: ['sigT'],
                            cty: 'text/plain',
                        };
                        data = {
                            'nonce': nonce['nonce'],
                            'clientId': this.clientId
                        };
                        return [4 /*yield*/, (0, jws_1.default)(this.privateKey, jwsHeader, data)];
                    case 2:
                        token = _a.sent();
                        return [2 /*return*/, token];
                }
            });
        });
    };
    moadian.prototype.getServerInformation = function () {
        return __awaiter(this, void 0, void 0, function () {
            var token, res;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, sendRequest_1.default)(this.apiBaseUrl + '/server-information', 'GET', token)];
                    case 2:
                        res = _a.sent();
                        return [2 /*return*/, res];
                }
            });
        });
    };
    moadian.prototype.sendInvoice = function (invoicesPackets) {
        return __awaiter(this, void 0, void 0, function () {
            var token, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestToken()];
                    case 1:
                        token = _a.sent();
                        return [4 /*yield*/, (0, sendRequest_1.default)(this.apiBaseUrl + '/invoice', 'POST', token, invoicesPackets)];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    };
    moadian.prototype.createInvoicePacket = function (invoiceHeader_1, invoiceBody_1) {
        return __awaiter(this, arguments, void 0, function (invoiceHeader, invoiceBody, invoicePayment) {
            var token, serverPublicKey, serverPublicKeyId, jwsHeader, invoiceJWS, jweHeader, payload, data;
            if (invoicePayment === void 0) { invoicePayment = []; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getServerInformation()];
                    case 1:
                        token = _a.sent();
                        serverPublicKey = token['publicKeys'][0]['key'];
                        serverPublicKeyId = token['publicKeys'][0]['id'];
                        jwsHeader = {
                            alg: 'RS256',
                            typ: 'jose',
                            x5c: [this.certificate.trim()],
                            sigT: moment().format('Y-m-d') + 'T' + moment().format('H:m:s') + 'Z',
                            crit: ['sigT'],
                            cty: 'text/plain',
                        };
                        return [4 /*yield*/, (0, jws_1.default)(this.privateKey, jwsHeader, { 'header': invoiceHeader, 'body': invoiceBody, 'payments': invoicePayment })];
                    case 2:
                        invoiceJWS = _a.sent();
                        jweHeader = {
                            'alg': 'RSA-OAEP-256',
                            'enc': 'A256GCM',
                            'kid': serverPublicKeyId,
                        };
                        return [4 /*yield*/, (0, jwe_1.default)(jweHeader, serverPublicKey, invoiceJWS)];
                    case 3:
                        payload = _a.sent();
                        data = {
                            'payload': payload,
                            'header': {
                                'requestTraceId': (0, uuid_1.v4)(),
                                'fiscalId': this.clientId,
                            },
                        };
                        return [2 /*return*/, data];
                }
            });
        });
    };
    moadian.prototype.generateInvoiceId = function (date, internalInvoiceId) {
        var daysPastEpoch = this.getDaysPastEpoch(date);
        var daysPastEpochPadded = daysPastEpoch.toString().padStart(6, '0');
        var hexDaysPastEpochPadded = this.dechex(daysPastEpoch).toString().padStart(5, '0');
        var numericClientId = this.clientIdToNumber();
        var internalInvoiceIdPadded = internalInvoiceId.toString().padStart(12, '0');
        var hexInternalInvoiceIdPadded = this.dechex(internalInvoiceId).toString().padStart(10, '0');
        var decimalInvoiceId = numericClientId + daysPastEpochPadded + internalInvoiceIdPadded;
        var checksum = (0, verhoeff_1.default)(decimalInvoiceId);
        return (this.clientId + hexDaysPastEpochPadded + hexInternalInvoiceIdPadded + checksum).toUpperCase();
    };
    moadian.prototype.generateInno = function (internalInvoiceId) {
        return this.dechex(internalInvoiceId).toString().padStart(10, '0');
    };
    moadian.prototype.getDaysPastEpoch = function (date) {
        return Math.round(date / (3600 * 24));
    };
    moadian.prototype.is_Numeric = function (s) {
        if (typeof s != 'string') {
            return false;
        }
        return !isNaN(s) && !isNaN(parseFloat(s));
    };
    moadian.prototype.clientIdToNumber = function () {
        var _this = this;
        var result = '';
        this.clientId.split('').forEach(function (char) {
            if (_this.is_Numeric(char)) {
                result += char;
            }
            else {
                result += _this.CHARACTER_TO_NUMBER_CODING[char];
            }
        });
        return result;
    };
    moadian.prototype.dechex = function (number) {
        if (number < 0) {
            number = 0xFFFFFFFF + number + 1;
        }
        return number.toString(16).toUpperCase();
    };
    moadian.prototype.inquiryByUId = function (UIds_1) {
        return __awaiter(this, arguments, void 0, function (UIds, startDateTime, endDateTime) {
            var token, params, result;
            if (startDateTime === void 0) { startDateTime = ''; }
            if (endDateTime === void 0) { endDateTime = ''; }
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.requestToken()];
                    case 1:
                        token = _a.sent();
                        params = 'fiscalId=' + this.clientId;
                        params += '&uidList=' + UIds;
                        result = (0, sendRequest_1.default)(this.apiBaseUrl + '/inquiry-by-uid?' + params, 'GET', token);
                        return [2 /*return*/, result];
                }
            });
        });
    };
    moadian.prototype.cerReplace = function (cer) {
        var certificate = cer.replace("-----BEGIN CERTIFICATE-----", "");
        certificate = certificate.replace("-----END CERTIFICATE-----", "");
        return certificate.trim();
    };
    return moadian;
}());
exports.moadian = moadian;
