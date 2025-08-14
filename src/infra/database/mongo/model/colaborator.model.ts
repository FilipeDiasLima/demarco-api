import * as mongoose from 'mongoose';

export const ColaboratorSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  cpf: { type: String, required: true },
  birthdate: { type: String, required: true },
  role: { type: String, required: true },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});
