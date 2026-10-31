import mongoose from "mongoose"

const schemeCacheSchema = new mongoose.Schema(
    {
        queryKey: {
            type: String,
            required: true,
            unique: true
        },
        results: [mongoose.Schema.Types.Mixed],
        fetchedAt: {
            type: Date,
            default: Date.now
        },
        expiresAt: {
            type: Date,
            required: true
        }
    },
    { timestamps: true }
)

// TTL index: MongoDB auto-deletes documents when expiresAt is reached
schemeCacheSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

const SchemeCache = mongoose.model("SchemeCache", schemeCacheSchema)

export default SchemeCache
