import multer from "multer"
import path from "path"
import crypto from "crypto"

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/")
    },
    filename: (req, file, cb) => {
        const uniqueName = crypto.randomUUID() + path.extname(file.originalname)
        cb(null, uniqueName)
    }
})

const upload = multer({ storage })

export default upload
