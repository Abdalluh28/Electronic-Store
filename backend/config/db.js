const dns = require("dns")
const mongoose = require("mongoose")

const connectDB = async () => {
    try {
        const url = process.env.MONGO_URL
        if(!url) {
            throw new Error("MONGO_URL is not defined")
        }

        if(process.env.DNS_SERVERS) {
            dns.setServers(process.env.DNS_SERVERS.split(",").map(server => server.trim()).filter(Boolean))
        }

        await mongoose.connect(url);
        console.log("MongoDB connected")
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}


module.exports = connectDB
