import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadToCloudinary = async (filePath) => {
    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "auto"
        })
        if (!result || !result.secure_url) {
            throw new Error("Cloudinary upload failed: no URL returned")
        }
        return result
    } catch (error) {
        throw new Error(`Cloudinary upload failed: ${error.message}`)
    }
}

export default uploadToCloudinary
