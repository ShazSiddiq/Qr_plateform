const { SMS_API_URL, SMS_USER, SMS_PASSWORD, SENDER_ID, TemplateID } = process.env;

// Function to create JWT token
const createToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET_KEY, { expiresIn: "7d" });
};

// Function to generate OTP
const generateOtp = () => crypto.randomInt(100000, 999999).toString();

// function for phone otp
const handlePhoneOtp = async (phone) => {
    const otp = generateOtp();
    // const hashedOtp = await bcrypt.hash(otp, 10);

    await OtpVerification.findOneAndUpdate(
        { phoneNumber: phone },
        { otp: otp, otpExpires: Date.now() + 15 * 60 * 1000 ,isOtpVerified:false},
        { upsert: true, new: true }
    );

    const smsMessage = `Dear user, ${otp} is your OTP. Valid for 15 min only and do not share with anyone - INNOBLES`;

    const smsParams = new URLSearchParams({
        User: SMS_USER,
        passwd: SMS_PASSWORD,
        MobileNumber: phone,
        Message: smsMessage,
        SID: SENDER_ID,
        mType: "N",
        DR: "Y",
        TemplateID,
    });

    await axios.post(SMS_API_URL, smsParams.toString(), {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    console.log("Phone OTP sent:", otp);
    return otp;
};

//function for email otp
const handleEmailOtp = async (email) => {
    const otp = generateOtp();
    // const hashedOtp = await bcrypt.hash(otp, 10);

    await OtpVerification.findOneAndUpdate(
        { email },
        { otp: otp, otpExpires: Date.now() + 15 * 60 * 1000 ,isOtpVerified:false },
        { upsert: true, new: true }
    );

    const subject = "Otp verification for Innobles Smart Technologies";
    const mailContent = `
                       <div style="max-width: 600px; margin: auto; font-family: Arial, sans-serif; font-size: 15px; color: #333; line-height: 1.6; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                     <h2 style="color: #d32f2f; text-align: center;">🔐 OTP Verification</h2>

                        <p>Dear User,</p>

                        <p style="font-size: 16px;">Your One-Time Password (OTP) for verification is:</p>

                        <div style="font-size: 22px; font-weight: bold; color: #d32f2f; text-align: center; margin: 20px 0;">
                               ${otp}
                       </div>

                        <p>This OTP is valid for <strong>15 minutes</strong> and should not be shared with anyone for security reasons.</p>

                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

                       <p>If you did not request this OTP or need further assistance, please contact our support team.</p>

                       <p style="margin-top: 30px;">
                       Best regards, <br>
                       🏢 <strong>Innobles Smart Technologies</strong> <br>
                        ✉️ <a href="mailto:support@innobles.com" style="text-decoration: none; color: #333;">support@innobles.com</a>
                       </p>
                       </div>
                    `;


    const mailSent = await sendMail(email, subject, mailContent);
    if (!mailSent) ApiResponse(res, 500, "Email OTP sending failed");

    console.log("Email OTP sent:", otp);
    return otp;
};