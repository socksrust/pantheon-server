// @flow
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const ROLES = {
  ADMIN: 'ADMIN',
  REGULAR: 'REGULAR',
};
const Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      hidden: true,
    },
    role: {
      type: String,
      required: true,
      default: ROLES.REGULAR,
    },
    email: {
      type: String,
      required: false,
      index: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'user',
  },
);

Schema.pre('save', function(next) {
  // Hash the password
  if (this.isModified('password')) {
    this.password = this.encryptPassword(this.password);
  }

  return next();
});

Schema.methods = {
  authenticate(plainTextPassword) {
    return bcrypt.compareSync(plainTextPassword, this.password);
  },
  encryptPassword(password) {
    return bcrypt.hashSync(password, 8);
  },
};

export default mongoose.model('User', Schema);
