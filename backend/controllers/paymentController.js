const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

const processPayment = async (req, res) => {
    const amount = 1000;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
        });


        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};


const payPalPayment = async (req, res) => {
    
    try {
        
        return res.send({ clientId: process.env.PAYPAL_CLIENT_ID })


    } catch (error) {
        return res.status(500).json({ message: error.message })
    }
}


module.exports = { processPayment, payPalPayment };
