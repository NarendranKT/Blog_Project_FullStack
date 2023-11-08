const mongoose = require('mongoose');

const dbConnect = async () => {
    try {
        // 4BFz2O1YmJdFcg1j
        const connection = process.env.CONNECTION;
        await mongoose.connect(connection);
        console.log("DB connected");
    } catch (error) {
        console.log("DB connection failed : ", error.message);
    }
};
dbConnect();
