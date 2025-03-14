const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const requestIp = require("request-ip");
const cors = require("cors");
// require("./db");

app.use(express.json());
app.use(cookieParser());
 
const corsOptions = {
    origin: "https://round-robbin-frontend-dpe8kxm06-anushkas-projects-3b34f5d3.vercel.app/", 
    credentials: true,  
};
app.use(cors(corsOptions));

app.use(requestIp.mw());
const Claim = require("./models/claim");
const Coupon = require("./models/coupon");

 
mongoose.connect(process.env.MONGO_CONN)
    .then(async () => {
        const existingCoupons = await Coupon.countDocuments();
        if (existingCoupons === 0) { 
            const coupons = [
                { code: "DISCOUNT10" },
                { code: "SAVE20" },
                { code: "FREESHIP" }
            ];
            await Coupon.insertMany(coupons);
            console.log("Coupons added successfully!");
        } else {
            console.log("Coupons already exist.");
        }
      
    })
    .catch(err => console.error("Error connecting to MongoDB:", err));



app.post("/claim", async (req, res) => {
    const ip = req.clientIp;
     
    if (req.cookies.coupon_claimed === "true") {
        return res.status(400).json({
            message: "You have already claimed a coupon in this session.",
        });
    }
    assignCoupon(ip, res);
});

async function assignCoupon(ip, res) {
    try {
        const existingClaim = await Claim.findOne({ ip });
        if (existingClaim) {
            const timeDiff = (new Date() - existingClaim.timestamp) / 60000;  
            if (timeDiff < 60) {
                return res.status(400).json({
                    message: `You must wait ${60 - Math.floor(timeDiff)} minutes before claiming another coupon.`,
                });
            }
        }

        const coupon = await Coupon.findOne({ assigned: false });
        if (!coupon) {
            return res.status(400).json({ message: "No coupons available." });
        }
       
        coupon.assigned = true;
        await coupon.save();

        await Claim.updateOne({ ip }, { ip, timestamp: new Date() }, { upsert: true });
         
        res.cookie("coupon_claimed", "true", { maxAge: 3600000, httpOnly: true });

        return res.json({
            message: "Coupon claimed successfully!",
            coupon: coupon.code,
        });
    } catch (error) {
        console.error("Error assigning coupon:", error);
        return res.status(500).json({ message: "Internal server error." });
    }
}
 
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));