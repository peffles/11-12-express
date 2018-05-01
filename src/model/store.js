'use strict';

import mongoose from 'mongoose';

const storeSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: () => new Date(),
  },
  brands: {
    type: String,
    required: false,
  },
});

export default mongoose.model('store', storeSchema);
