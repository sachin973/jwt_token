const jwt=require('jsonwebtoken')
const config=require('./config')

module.exports=(credentials=[])=>{
    return (req,res,next)=>{
        console.log("Authorization")
        if(typeof credentials === "string"){
            credentials = [credentials]
        }
        const token=req.headers["authorization"]
        if(!token){
            return res.status(401).send("denied")
        }else{
            const tokenbody=token.slice(7)
            jwt.verify(tokenbody,config.JWT_SECRET,(err,dpayload)=>{
                if(err){
                    console.log(`Error ${err}`)
                    return res.status(401).send("denied")
                }
                if(credentials.length>0){
                    if(dpayload.scopes && dpayload.scopes.length && credentials.some(cred=>dpayload.scopes.indexOf(cred)>=0)){
                        next()
                    }else{
                       return  res.status(401).send("denied")
                    }
                }else{
                    next()
                }
            })
        }
    }
}