import mongoose from 'mongoose';

export const connection = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: 'JOB_PORTAL'
    }).then(()=>{
        console.log('Connected to Database')
    }).catch(err=>{
        console.log(`Some error occured:${err}`)
    })
}