import mongoose from "mongoose"
import colors from "colors"

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${conn.connection.host}`.cyan.bold)
    } catch (error) {
        console.error("MongoDB connection failed. Check MONGO_URI in .env and that MongoDB is running.".red.bold)
        console.error(error.message)
        process.exit(1)
    }
}

export default connectDB
