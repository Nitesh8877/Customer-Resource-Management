const nodemailer = require("nodemailer")

module.exports = nodemailer.createTransport({
    service: "gmail",
    debug: true,
    auth: {
        user: 'kumarnitesh88441@gmail.com',
        pass: 'ugrcbehcejjokixu'
    }
})