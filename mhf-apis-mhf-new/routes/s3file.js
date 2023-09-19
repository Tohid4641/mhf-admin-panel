var express = require("express");
var router = express.Router();
const upload = require('../controllers/S3FileBasedController');

const singleUpload = upload.single('image');

router.post('/image_upload', function (req, res) {
    console.log('1')
    singleUpload(req, res, function (err) {

        if (err) {
            return res.status(422).send({ errors: [{ title: 'File Upload Error', detail: err.message }] });
        }
        
        return res.json({ 'imageUrl': req.file.location, 'fileName': req.file.key, 'bucket': req.file.bucket  });
    });
});


module.exports = router;
