const auth = (req,res,next)=>{
    if(!req.session.userId){
        return res.status(403).json({error:"Acceso denegado"});
    }
    next();
}

module.exports = auth;