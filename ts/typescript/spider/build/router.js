"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var crowller_1 = __importDefault(require("./utils/crowller"));
var dellAnalyzer_1 = __importDefault(require("./utils/dellAnalyzer"));
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var checkLogin = function (req, res, next) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        next();
    }
    else {
        res.send('请先登录');
    }
};
var router = express_1.Router();
router.get('/', function (req, res) {
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send("\n        <html>\n        <body>\n          <a href=\"/getData\">spider</a>\n          <a href=\"/showData\">show</a>\n          <a href=\"/logout\">\u9000\u51FA</a>\n        </body>\n      </html>\n    ");
    }
    else {
        res.send("\n      <html>\n        <body>\n          <form method=\"post\" action=\"/login\">\n            <input type=\"password\" name=\"password\" />\n            <button>\u767B\u5F55</button>\n          </form>\n        </body>\n      </html>\n    ");
    }
});
router.post('/login', function (req, res) {
    var password = req.body.password;
    var isLogin = req.session ? req.session.login : false;
    if (isLogin) {
        res.send('已经登陆过');
    }
    else {
        if (password === '123' && req.session) {
            req.session.login = true;
            res.send('登陆成功');
        }
        else {
            res.send('登陆失败');
        }
    }
});
router.get('/logout', function (req, res) {
    if (req.session) {
        req.session.login = undefined;
    }
    res.redirect('/');
});
router.get('/getData', checkLogin, function (req, res) {
    var secret = 'secretKey';
    var url = "http://www.dell-lee.com/typescript/demo.html?secret=" + secret;
    var analyzer = dellAnalyzer_1.default.getInstance();
    new crowller_1.default(url, analyzer);
    res.send('getData Success!');
});
router.get('/showData', checkLogin, function (req, res) {
    try {
        var url = path_1.default.resolve(__dirname, '../data/course.json');
        var result = fs_1.default.readFileSync(url, 'utf-8');
        res.json(JSON.parse(result));
    }
    catch (e) {
        res.send("尚未爬取到内容");
    }
});
exports.default = router;
