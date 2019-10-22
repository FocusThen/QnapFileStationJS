const { ezEncode } = require("./get_sid");
const fetch = require("node-fetch");

class Qnap {
  constructor(host, user, passwd, port = "8080") {
    this.host = host;
    this.user = user;
    this.port = port;
    this.passwd = passwd;
    this.sid = "";
    this.loggedIn = this.login(user, passwd);
  }

  async login(user, passwd) {
    let pwd = ezEncode(passwd);

    const loginEndpoint = await this.endpoint(
      "filemanager/wfm2Login.cgi",
      null,
      {
        user,
        pwd
      }
    );
    const response = await this.req(loginEndpoint);
    let jsondata = await response;
    if (jsondata.sid !== undefined) {
      this.sid = jsondata.sid;
    }
  }

  async req(endpoint) {
    const response = await fetch(endpoint);
    const JsonData = await response.json();
    return JsonData;
  }

  endpoint(cgi = null, func = null, parameters = null) {
    if (cgi === null) {
      cgi = "filemanager/utilRequest.cgi";
    }
    let ret = this.baseEndpoint(cgi) + "?";

    if (func !== null) {
      ret = this.addParam(ret, "func", func);
    }
    if (this.sid !== "") {
      ret = this.addParam(ret, "sid", this.sid);
    }

    let deneme = parameters;
    for (const [key, value] of Object.entries(deneme)) {
      ret = this.addParam(ret, key, value);
    }
    return ret;
  }

  baseEndpoint(cgi = "filemanager/utilRequest.cgi") {
    const ret = "http://" + this.host + ":" + this.port + "/cgi-bin/" + cgi;
    return ret;
  }

  addParam(baseUrl, param, value) {
    let retValue = baseUrl;
    if (!baseUrl.endsWith("?")) {
      retValue += "&";
    }
    return retValue + param + "=" + value;
  }
}

module.exports.Qnap = Qnap;
