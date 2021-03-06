const config = require('config.json');
const util = require("util");
const multer = require("multer");
const GridFsStorage = require("multer-gridfs-storage");

var storage = new GridFsStorage({
    url: config.connectionString,
    options: { useNewUrlParser: true, useUnifiedTopology: true },
    file: (req, file) => {
      const match = ["image/png", "image/jpeg"];
  
      if (match.indexOf(file.mimetype) === -1) {
        const filename = req.body.userId + `-${file.originalname}`;
        return filename;
      }
  
      return {
        bucketName: "images",
        filename: req.body.userId + `-${file.originalname}`
      };
    }
  });
  
  var uploadFile = multer({ storage: storage }).single("data");
  var uploadFilesMiddleware = util.promisify(uploadFile);
  module.exports = uploadFilesMiddleware;