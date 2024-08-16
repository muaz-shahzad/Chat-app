require('dotenv').config()

const MONGODB_URI = process.env.MONGODB_URI;


async function connectdb(){
    try{
        await mongoose.connect(MONGODB_URI)
    } catch(error)
    {
        console.log('Error connecting to MongoDB', err)
    }
}




module.exports = conn