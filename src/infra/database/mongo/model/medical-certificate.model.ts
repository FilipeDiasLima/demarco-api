import * as mongoose from 'mongoose';

export const MedicalCertificateSchema = new mongoose.Schema({
  collaboratorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Colaborator',
    required: true,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true,
  },
  certificateDateTime: { type: Date, required: true },
  leaveDays: { type: Number, min: 1, max: 365, required: true },
  cid: {
    code: { type: String, required: true },
    description: { type: String, required: true },
  },
  notes: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});
