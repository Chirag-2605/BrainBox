const mongoose = require('mongoose');

module.exports = () =>{
    const mongooseLink = "mongodb://127.0.0.1:27017/brainBox";
main().then(()=>{
    console.log("Connected to DB :)");
}).catch((err)=>{
    console.log("Conncection failed :(");
});
async function main() {
    await mongoose.connect(mongooseLink);
} 
}

