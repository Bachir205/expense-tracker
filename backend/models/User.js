const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name:     { type: String, required: [true, 'Name is required'], trim: true, maxlength: 50 },
  email:    { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, match: [/\S+@\S+\.\S+/, 'Invalid email'] },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  currency: { type: String, default: 'XOF', enum: ['USD','EUR','GBP','JPY','CAD','AUD','XOF'] },
  avatar:   { type: String, default: '' },
}, { timestamps: true });

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (entered) {
  return await bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', UserSchema);
