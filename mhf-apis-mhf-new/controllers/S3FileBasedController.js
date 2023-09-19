const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const config = require('config');

aws.config.update({
    secretAccessKey: '4/SEGDGguROiiGKMw2SC6YaMUOTFMbDYOQqJNM+n',
    accessKeyId: 'AKIAJDWIRYNE6LGULE6Q',
    region: 'ap-south-1'
});

const s3 = new aws.S3();

const fileFilter = (req, file, cb) => {
    const ftype = file.mimetype ? (file.mimetype.split('/'))[0] : '';
    //if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    if (ftype === 'image' || ftype === 'video') {
        cb(null, true)
    } else {
        cb(new Error('Invalid Mime Type, only Images and videos allowed'), false);
    }
}

const upload = multer({
    fileFilter,
    storage: multerS3({
        s3,
        bucket: 'mla-storage',
        acl: 'public-read',
        metadata: function (req, file, cb) {
            cb(null, { fieldName: 'TESTING_META_DATA!' });
        },
        key: function (req, file, cb) {
	    var fsplit = file.mimetype ? (file.mimetype.split('/')) : '';
            var ftype = fsplit.pop();
            var fcombine = file.originalname ? file.originalname.split('.').slice(0, -1).join('.') : '';
	    fcombine = fcombine.replace(/ /g, '-')
            cb(null, fcombine+Date.now().toString()+"."+ftype)
        }
    })
})

module.exports = upload;
