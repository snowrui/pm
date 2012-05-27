/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */

/**
 * @进程状态机
 */
exports.STATUS  = {
  'PENDING' : 0,        /**<    准备状态    */
  'RUNNING' : 1,        /**<    可接受服务  */
  'STOPING' : 2,        /**<    准备关闭    */
};

/**
 * @消息类型
 */
exports.MESSAGE = {
  'GET_FD'  : 11,       /**<    获取句柄 (worker -> master) */
  'REQ_FD'  : 12,       /**<    请求句柄 (master -> worker) */
  'WAKEUP'  : 14,       /**<    唤醒消息 (master -> worker) */
  'LISTEN'  : 16,       /**<    监听端口 (master -> worker) */
  'STATUS'  : 21,       /**<    状态报告 (worker -> master) */
  'RELOAD'  : 23,       /**<    重载进程 (worker -> master) */
  'SENDTO'  : 31,       /**<    转发消息 (worker -> master) */
  'COMMAND' : 32,       /**<    命令消息 (master -> worker) */
};

/**
 * @打印日志
 */
exports.debug   = function(name, message) {
  console.log('[' + (name || 'unknown') + ':' + process.pid + '][' + new Date() + '] ' + message);
};

/**
 * @监听端口或者socket
 */
/* {{{ public function listen() */
var __isNumber  = function (x) {
  return (x = Number(x)) >= 0 ? x : false;
};

var TCP  = process.binding('tcp_wrap').TCP;
var Pipe = process.binding('pipe_wrap').Pipe;
exports.listen  = function(port, connection) {
  var _addr = __isNumber(port);
  if (_addr) {
    var _me = new TCP();
    _me.listen('0.0.0.0', _addr);
  } else {
    var _me = new Pipe();
    _me.listen(port);
  }

  _me.listen(1024);
  _me.onconnection  = function(handle) {
    connection(handle);
  };

  return _me;
};
/* }}} */
