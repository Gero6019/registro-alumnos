const auth = (req,res,next)=>{
    if(!req.session.userId){
        return res.status(401).json({error:"Acceso denegado"});
    }
    next();
}

module.exports = auth;