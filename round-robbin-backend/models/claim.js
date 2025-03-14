const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ClaimSchema = new Schema({
    ip: String,
    timestamp: Date,
});

const claim=mongoose.model('claim',ClaimSchema);
module.exports=claim 