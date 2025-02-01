import multer from "multer";
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';

const uploadDir = 'public/images/uploads';

// Ensure directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir); // Ensure the path is correct
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, (err, name) => {
            const fn = name.toString('hex') + path.extname(file.originalname);
            cb(null, fn);
        });
    }
});

const upload = multer({ storage: storage });

export default upload;
