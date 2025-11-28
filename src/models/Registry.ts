import mongoose from 'mongoose'

const registrySchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: true },
    phone: { type: String, required: true, unique: true, trim: true },
    year: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    comment: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  },
  { timestamps: true }
)

registrySchema.index({ phone: 1 }, { unique: true })
registrySchema.index({ userId: 1, updatedAt: -1 })
registrySchema.index({ userId: 1, name: 1 })

export default mongoose.models.Registry || mongoose.model('Registry', registrySchema)
