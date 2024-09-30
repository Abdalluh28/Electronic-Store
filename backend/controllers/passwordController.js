const User = require('../models/userModel');
const asyncHandler = require('../middleware/asyncHandler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const forgotPassword = asyncHandler(async (req, res) => {
    const {email} = req.body;

    const existingUser = await User.findOne({email});

    if(!existingUser){
        return res.status(404).json({message: 'User not found'})
    }

    const accessToken = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'abdok7496@gmail.com',
          pass: 'nmyk kfxb idjj ryqk'
        }
      });
      
      var mailOptions = {
        from: 'abdok7496@gmail.com',
        to: email,
        subject: 'Reset Password',
        text: `${process.env.CLIENT_URL}/password/reset/${existingUser._id}/${accessToken}`
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        } else {
          return res.status(200).json({message: 'Email sent: ' + info.response});
        }
      });


})

const resetPassword = asyncHandler(async (req, res) => {
    const {id, accessToken, password} = req.body;

    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
        if(err) {
            return res.status(401).json({message: 'Unauthorized'})
        } else {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = await User.findOneAndUpdate({_id: id}, {password: hashedPassword});
            return res.status(200).json({message: 'Password reset successful'})
        }
    })
})

module.exports = {
    forgotPassword,
    resetPassword
}