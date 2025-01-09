import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    mode: { type: String, required: true, enum: ['dark', 'light'], default: 'dark' },
    role: { type: String, required: true, enum: ['admin'], default: 'admin' },
    userId: { type: mongoose.Schema.Types.ObjectId, required: false, ref: 'users' },
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model('User', userSchema)
