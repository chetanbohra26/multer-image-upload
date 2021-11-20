const express = require("express");
const multer = require("multer");

const app = express();
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString() + " " + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
};

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 5,
    },
    fileFilter,
}).single("imageData");

app.get("/", (req, res) => {
    res.send("hello");
});

app.post("/uploadImage", (req, res) => {
    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === "LIMIT_FILE_SIZE")
                return res.status(400).json({
                    success: false,
                    error: err.message,
                    code: err.code,
                });
            return res.status(400).json({
                success: false,
                error: "Invalid file",
            });
        } else if (err) {
            res.status(500).json({
                success: false,
                message: "Internal Server Error",
                err,
            });
        }
        res.send(req.file);
    });
});

const PORT = process.env.PORT || 7500;
app.listen(PORT, () => console.log(`Listening on port ${PORT}..!`));
