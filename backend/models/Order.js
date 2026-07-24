const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    _id: { type: Number, required: true },
    title: { type: String, default: '' },
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: 'COD' },
    orderNotes: { type: String, default: '' },
    items: [orderItemSchema],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

orderSchema.pre('validate', async function (next) {
  if (!this.isNew || this._id) {
    return next();
  }

  try {
    const lastOrder = await Order.findOne({ _id: { $type: 'number' } })
      .sort({ _id: -1 })
      .select('_id');

    this._id = lastOrder ? Number(lastOrder._id) + 1 : 101;
    next();
  } catch (error) {
    next(error);
  }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
