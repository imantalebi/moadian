"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./index");
var moment = require("moment");
var fs = require("fs");
var clientId = "شناسه یکتا";
var privateKey = fs.readFileSync('private.key', "utf-8").toString();
var certificate = fs.readFileSync('certificate.txt', "utf-8");
var send = new index_1.moadian(clientId, privateKey, certificate, true);
var invoiceId = 100; //شماره فاکتور
var taxid = send.generateInvoiceId(moment().unix(), invoiceId);
var inno = send.generateInno(invoiceId);
var invoiceHeader = {
    'taxid': taxid,
    'inno': inno,
    'indatim': moment().unix() * 1000,
    'inty': 2, // 1|2|3
    'ins': 1, //اصلی / اصلاحی / ...
    'inp': 1,
    'tins': '00000000000', //شناسه ملی فروشنده
    'tob': 2, // نوع شخص خریدار در الگوی نوع دوم اختیاریه
    'bid': '',
    'tinb': '', // شماره اقتصادی خریدار
    'tprdis': 10000, // مجموع مبلغ قبل از کسر تخفیف
    'tdis': 0, // مجموع تخفیف
    'tadis': 0, // مجموع مبلغ پس از کسر تخفیف
    'tvam': 900, // مجموع مالیات ارزش افزوده
    'tbill': 10900, //مجموع صورتحساب
    'setm': 1, // روش تسویه
};
var invoiceBody = [{
        'sstid': '2720000114542', //شناسه کالا یا خدمات
        'sstt': 'نام کالا یا خدمات',
        'mu': 1627, //واحد اندازه گیری
        'am': 1, //تعداد
        'fee': 10000,
        'prdis': 10000, //قبل از تخفیف
        'dis': 0, //تخفیف
        'adis': 0, //بعد از تخفیف
        'vra': 9, //نرخ مالیات
        'vam': 900, //مالیات
        'tsstam': 10900, //مبلغ کل
    }];
send.createInvoicePacket(invoiceHeader, invoiceBody).then(function (invoicePack) {
    send.sendInvoice(invoicePack).then(function (res) {
        console.log(res);
    });
});
// send.inquiryByUId("826c7008-12b2-4689-8ce1-0aec204e03b6").then(function(res){
//     console.log(JSON.stringify(res))
// })
