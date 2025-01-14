import mongoose from 'mongoose'

const checkupSchema = new mongoose.Schema(
  {
    device: { type: String, trim: true },
    drugs: { type: String, trim: true }, // dorilar
    xijoma: {
      head: { type: [Number] },
      backOfBody: { type: [Number] },
      frontOfBody: { type: [Number] },
      other: { type: [Number] },
    },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'registries' },
  },
  { timestamps: true }
)

export default mongoose.models.Checkup || mongoose.model('Checkup', checkupSchema)
