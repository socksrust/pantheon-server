// @flow
import mongoose from 'mongoose';

const SchemaSchedule = new mongoose.Schema({
  talker: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: false,
  },
  time: {
    type: Number,
    required: false,
    min: 0,
  },
});

const Schema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    date: {
      type: String,
      required: true,
    },
    publicLimit: {
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

export default mongoose.model('Event', Schema);
