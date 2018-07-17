// @flow
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Schema.Types;

const SchemaSchedule = new mongoose.Schema({
  talker: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  time: {
    type: String,
  },
});

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
      required: true,
      description: 'User that created this event',
    },
    description: {
      type: String,
    },
    date: {
      type: String,
    },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number, Number], default: [0, 0] },
      cep: { type: String },
      street: { type: String },
      number: { type: String },
    },
    publicLimit: {
      type: String,
    },
    publicList: {
      type: [String],
      required: true,
      default: [],
    },
    waitList: {
      type: [String],
      required: true,
      default: [],
    },
    notGoingList: {
      type: [String],
      required: true,
      default: [],
    },
    image: {
      type: String,
    },
    schedule: [SchemaSchedule],
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'event',
  },
);

Schema.index({ location: '2dsphere' });

export default mongoose.model('Event', Schema);
