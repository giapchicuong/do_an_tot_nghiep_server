const multer = require("multer");
const path = require("path");
const fs = require('fs');
const { removeBackground } = require('@imgly/background-removal-node');

const PATH_1 = '../.././assets/images/image_review_fruits'
const PATH_2 = '../.././assets/images/images_review_fruits_no_background'


async function removeImageBackground(imgSource) {
    try {
        // Chuyển đổi đường dẫn sang dạng tuyệt đối
        const absolutePath = path.resolve(imgSource);

        // Kiểm tra file có tồn tại hay không
        if (!fs.existsSync(absolutePath)) {
            throw new Error(`File not found: ${absolutePath}`);
        }

        // Chuyển đường dẫn sang dạng `file://`
        const fileURL = new URL(`file://${absolutePath}`);

        console.log(`Processing file: ${fileURL.href}`);

        // Thay thế với hàm `removeBackground` (giả định nó hỗ trợ `file://`)
        const blob = await removeBackground(fileURL.href);

        // Chuyển đổi Blob sang Buffer
        const buffer = Buffer.from(await blob.arrayBuffer());

        // Tạo data URL
        const dataURL = `data:image/png;base64,${buffer.toString("base64")}`;

        return dataURL;
    } catch (error) {
        throw new Error('Error removing background: ' + error.message);
    }
}

const removeBg = async (imagePath, imagePath2) => {

    // Removing background from the input image
    const resultDataURL = await removeImageBackground(imagePath);

    // Lấy ngày hiện tại
    const currentDate = new Date();

    // Định dạng ngày theo day-month-year
    const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

    // Tạo một chuỗi định danh duy nhất
    const uniqueSuffix = formattedDate + "-" + Math.round(Math.random() * 1e9);

    fs.writeFileSync(imagePath2, resultDataURL.split(';base64,').pop(), { encoding: 'base64' });

    // Logging success message
    console.log('Background removed successfully.');

}


const storage = multer.diskStorage({
    path,
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, PATH_1));
    },
    filename: (req, file, cb) => {
        // Lấy ngày hiện tại
        const currentDate = new Date();

        // Định dạng ngày theo day-month-year
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        // Tạo một chuỗi định danh duy nhất
        const uniqueSuffix = formattedDate + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});

const upload = multer({

    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only png, jpg, and jpeg are allowed."));
        }
    },
}).single('image');

const getImage = async (req, res) => {

    const { imageName } = req.params;
    const imagePath = path.join(__dirname, PATH_1, imageName);
    const imagePath2 = path.join(__dirname, PATH_2, imageName);

    // Kiểm tra nếu file tồn tại
    if (fs.existsSync(imagePath)) {
        // Gửi hình ảnh với MIME type đúng
        removeBg(imagePath, imagePath2)
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
}

const storageNoBackground = multer.diskStorage({
    path,
    destination: (req, file, cb) => {
        cb(null, path.resolve(__dirname, PATH_2));
    },
    filename: (req, file, cb) => {
        // Lấy ngày hiện tại
        const currentDate = new Date();

        // Định dạng ngày theo day-month-year
        const formattedDate = `${currentDate.getDate()}-${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

        // Tạo một chuỗi định danh duy nhất
        const uniqueSuffix = formattedDate + "-" + Math.round(Math.random() * 1e9);

        cb(null, uniqueSuffix + "_" + file.originalname);
    },
});

const uploadNoBackground = multer({

    storage: storageNoBackground,
    limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ["image/png", "image/jpg", "image/jpeg"];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type. Only png, jpg, and jpeg are allowed."));
        }
    },
});

const getImageNoBackground = async (req, res) => {

    const { imageName } = req.params;
    const imagePath = path.join(__dirname, PATH_2, imageName);

    // Kiểm tra nếu file tồn tại
    if (fs.existsSync(imagePath)) {
        // Gửi hình ảnh với MIME type đúng
        res.sendFile(imagePath);
    } else {
        res.status(404).json({ error: 'Image not found' });
    }
}




module.exports = { upload, getImage, uploadNoBackground, getImageNoBackground };
