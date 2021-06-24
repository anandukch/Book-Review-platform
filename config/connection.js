const mongoClient=require('mongodb').MongoClient
const state={
    db:null
}
module.exports.connect=function(done){
    const url=`mongodb+srv://${process.env.MONGO_BD_USER}:${process.env.MONGO_BD_PASSWORD}@cluster0.6fxys.mongodb.net/${process.env.MONGO_BD_DATABASE}?retryWrites=true&w=majority`
    const dbname=process.env.MONGO_BD_DATABASE

    mongoClient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname) 
        done()
    })
   
}

module.exports.get=function(){
    return state.db
}
