import mongoose from 'mongoose'

const checkupSchema = new mongoose.Schema(
  {
    device: { type: String, trim: true },
    drugs: { type: String, trim: true },
    xijoma: { type: [Number] },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
  },
  { timestamps: true }
)

export default mongoose.models.Checkup || mongoose.model('Checkup', checkupSchema)
