const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  middleName: { type: String, default: '' },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  address: {
    flatHouseNo: { type: String, required: true },
    areaStreet: { type: String, required: true },
    landmark: { type: String, default: '' },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  expiresAt: { type: Date, required: true, default: () => new Date(Date.now() + 10 * 60 * 1000) } // 10 minutes
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);