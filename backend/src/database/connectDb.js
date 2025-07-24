import mongoose from "mongoose"


const ConnectDb = async () => {
    try {
        const res = await mongoose.connect(`${process.env.MONGO_URL}/${process.env.DB_NAME}`)
    } catch (error) {
        console.log("Fail to connect db", error);
        process.exit(1)
    }
}

export { ConnectDb }