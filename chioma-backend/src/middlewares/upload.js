const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Il file caricato non è un\'immagine valida (JPEG, PNG, WebP).'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Max 10MB
    },
    fileFilter: fileFilter
});

module.exports = upload;
