/**
 * Telegram Bot token released from Botfather
 * @type {string}
 */
exports.telegramToken = "162143573:AAF6OkqZpvQbqIMDtUKY0G72eYdzks0GP4E";
/**
 * Mongodb connection url
 * @type {string}
 */
exports.mongoDbUrl = "mongodb://127.0.0.1:27017/local";
//
///**
// * WebHook configuration
// * @type {{host: string, port: number, cert: string, key: string, domain: string}}
// */
//exports.webHook = {
//  /**
//   * Host
//   */
//  host: '0.0.0.0',
//
//  /**
//   * Port
//   */
//  port: 8443,
//
//  /**
//   * PEM certificate (public) to webHook server.
//   */
//  //cert: 'etc/telegram.pem',
//
//  /**
//   * PEM private key to webHook server.
//   */
//  //key: 'etc/telegram.key',
//
//  /**
//   * Webhook domain (must be the same of CN of the certificate)
//   */
//  domain: 'yourdomain.example.com',
//
//  /**
//   * Custom Webhook url (optional)
//   */
//  url: 'https://' + this.domain + ':' + this.port + '/bot' + exports.telegramToken
//};
/**
 * WebHook configuration
 * @type {{host: string, port: number, cert: string, key: string, domain: string}}
 */
exports.webHooka = {
  /**
   * Host
   */
  host: process.env.OPENSHIFT_NODEJS_IP,
  /**
   * Port
   */
  port: process.env.OPENSHIFT_NODEJS_PORT,
  /**
   * PEM certificate (public) to webHook server.
   */
//cert: 'etc/telegram.pem',
  /**
   * PEM private key to webHook server.
   */
//key: 'etc/telegram.key',
  /**
   * Webhook domain (must be the same of CN of the certificate)
   */
  domain: 'devtelegbot-devtelegdomain.rhcloud.com',
  /**
   * Custom Webhook url
   */
  url: 'https://devtelegbot-devtelegdomain.rhcloud.com/bot' + exports.telegramToken
};
/**
 * Enable Long Polling instead of WebHook
 * @type {boolean|object}
 */
exports.polling = true;