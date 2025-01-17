import mongoose from 'mongoose'

const checkupSchema = new mongoose.Schema(
  {
    device: { type: String, trim: true },
    drugs: { type: String, trim: true }, // dorilar
    xijoma: {
      head: [{ x: { type: Number, trim: true }, y: { type: Number, trim: true } }],
      backOfBody: [{ x: { type: Number, trim: true }, y: { type: Number, trim: true } }],
      frontOfBody: [{ x: { type: Number, trim: true }, y: { type: Number, trim: true } }],
      other: [{ x: { type: Number, trim: true }, y: { type: Number, trim: true } }],
    },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'users' },
    clientId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'registries' },
    comment: { type: String, trim: true },
    createdOn: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.models.Checkup || mongoose.model('Checkup', checkupSchema)
