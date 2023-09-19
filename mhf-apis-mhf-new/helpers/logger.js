const log4js = require("log4js");
log4js.configure({
    appenders: { compresssuccess: { type: "file", filename: "compress.log" }, 
                    compresserror: { type: "file", filename: "compress-error.log" } },
    categories: { default: { appenders: ["compresssuccess"], level: "info" },
                    compresserror: { appenders: ["compresserror"], level: "error" } }
});

exports.logData = function (type, msg) {

    let logger = null;
    if(type == "compress-success")
        logger = log4js.getLogger("compresssuccess");
    if(type == "compress-error")
        logger = log4js.getLogger("compresserror");
    else // default case
        logger = log4js.getLogger("compress");
    logger.error(msg);
    
	return true;

};