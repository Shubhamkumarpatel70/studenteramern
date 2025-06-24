const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create the uploads directory if it doesn't exist
const uploadDir = 'backend/uploads/tasks';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Set up storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Check file type
function checkFileType(file, cb) {
    // Allowed extensions
    const filetypes = /zip|rar|7z/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype) || file.mimetype === 'application/zip' || file.mimetype === 'application/x-zip-compressed' || file.mimetype === 'application/x-rar-compressed' || file.mimetype === 'application/x-7z-compressed';

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Compressed files only! (zip, rar, 7z)');
    }
}

// Init upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        checkFileType(file, cb);
    }
}).single('projectFile'); // 'projectFile' is the name of the form field

// Payment screenshot upload config
const paymentScreenshotDir = 'backend/uploads/paymentScreenshots';
if (!fs.existsSync(paymentScreenshotDir)) {
    fs.mkdirSync(paymentScreenshotDir, { recursive: true });
}

const paymentScreenshotStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, paymentScreenshotDir);
    },
    filename: (req, file, cb) => {
        cb(null, `paymentScreenshot-${Date.now()}${path.extname(file.originalname)}`);
    }
});

function checkImageFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images only! (jpeg, jpg, png, webp)');
    }
}

const uploadPaymentScreenshot = multer({
    storage: paymentScreenshotStorage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        checkImageFileType(file, cb);
    }
}).single('paymentScreenshot');

module.exports = Object.assign(upload, { uploadPaymentScreenshot }); 