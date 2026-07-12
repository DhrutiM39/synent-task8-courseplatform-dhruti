const Razorpay = require("razorpay");
const crypto = require("crypto");
const Enrollment = require("../models/Enrollment");
const Payment = require("../models/Payment");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const createOrder = async (req, res) => {
  try {
    const { amount, courseId } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    // Persist the order so we can audit it and update status on verification.
    await Payment.create({
      user: req.user.id,
      course: courseId,
      razorpayOrderId: order.id,
      amount: amount,          // stored in original units (INR), not paise
      status: "created",
    });

    res.status(200).json({
      order,
      courseId,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.log("RAZORPAY CREATE ORDER ERROR:", error);

    res.status(500).json({
      message: error.error?.description || error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
    } = req.body;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({
        message: "Invalid payment signature",
      });
    }

    // Mark the payment record as paid now that the signature is valid.
    await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { razorpayPaymentId: razorpay_payment_id, status: "paid" }
    );

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
    });

    // Send enrollment email (non-blocking)
    try {
      const user = await User.findById(req.user.id).select("email");
      if (user?.email) {
        await sendEmail({
          email: user.email,
          subject: "Enrollment confirmed",
          message: `<p>Hi ${user.email},</p><p>Your payment was successful and you are enrolled.</p><p>Regards,<br/>Synent Team</p>`,
        });
      }
    } catch (mailErr) {
      console.log("ENROLLMENT EMAIL ERROR:", mailErr.message || mailErr);
    }

    res.status(200).json({
      message: "Payment verified and enrollment successful",
      enrollment,
    });
  } catch (error) {
    console.log("VERIFY PAYMENT ERROR:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};

const demoPaymentSuccess = async (req, res) => {
  // Guard: only allow demo payments when explicitly enabled via env flag.
  if (process.env.ALLOW_DEMO_PAYMENTS !== "true") {
    return res.status(403).json({ message: "Demo payments are disabled." });
  }

  try {
    const { courseId } = req.body;

    const alreadyEnrolled = await Enrollment.findOne({
      user: req.user.id,
      course: courseId,
    });

    if (alreadyEnrolled) {
      return res.status(400).json({
        message: "Already enrolled",
      });
    }

    const enrollment = await Enrollment.create({
      user: req.user.id,
      course: courseId,
    });

    // Send enrollment email (non-blocking)
    try {
      const user = await User.findById(req.user.id).select("email");
      if (user?.email) {
        await sendEmail({
          email: user.email,
          subject: "Enrollment confirmed",
          message: `<p>Hi ${user.email},</p><p>You're enrolled successfully (demo payment).</p><p>Regards,<br/>Synent Team</p>`,
        });
      }
    } catch (mailErr) {
      console.log("ENROLLMENT EMAIL ERROR:", mailErr.message || mailErr);
    }

    res.status(200).json({
      message: "Demo payment successful and enrollment created",
      enrollment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  verifyPayment,
   demoPaymentSuccess,
};