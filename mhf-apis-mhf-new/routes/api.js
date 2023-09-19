var express = require("express");
var userRouter = require("./user");
var adminRouter = require("./admin");
var fileRouter = require("./file");
var fireBasedRouter = require("./firebased");
var s3FileRouter = require("./s3file");
var app = express();
app.use("/user/", userRouter);
app.use("/admin/", adminRouter);
app.use("/file/", fileRouter);
app.use("/firebased/", fireBasedRouter);
app.use("/s3file/", s3FileRouter);


module.exports = app;