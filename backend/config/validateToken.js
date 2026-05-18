var jwt = require("jsonwebtoken");
function validateTokenn2(req,resp,next)
{
        console.log("********")
       
       const full_token = req.headers['authorization'];//keyword
        console.log(full_token);
    
        var ary=full_token.split(" "); // ["Bearer","token_value"]
        let actualToken=ary[1]; // Bearer token_value
        let TokenValidObj;
        console.log(process.env.JWT_SECRET_KEY)
    
        try{
            TokenValidObj= jwt.verify(actualToken,process.env.JWT_SECRET_KEY);
            console.log(TokenValidObj);
            if(TokenValidObj!=null)
            {
                const payload = jwt.decode(ary[1]);
                console.log(payload);
                next();   // next decide here to send to the next parameter of the router or not
                //resp.json({status:true,msg:"**Aauthorized",item:payload});
            }
            else
            resp.json({status:false,msg:"**Invalid Token"});
            
            
        }
        catch(err)
        {
            resp.json({status:false,msg:err.message});
            return;
        }
            
}
module.exports={validateTokenn2};
