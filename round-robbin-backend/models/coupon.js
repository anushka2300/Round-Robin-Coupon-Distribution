const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const CouponSchema = new Schema({
    code: String,
    assigned: { type: Boolean, default: false },
});

const coupon=mongoose.model('coupon',CouponSchema);
module.exports=coupon 