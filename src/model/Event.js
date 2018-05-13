// @flow
import mongoose from 'mongoose';

const SchemaSchedule = new mongoose.Schema({
  talker: {
    type: String,
    required: false,
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
    type: String,
    required: true,
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

export default mongoose.model('Event', Schema);
