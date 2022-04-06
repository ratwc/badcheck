const fs = require('fs');  

const Reset = async (req, res) => { 

    if(req.method == 'POST'){
         
        fs.truncate('file/participant.txt', 0, function(){console.log('done')}) 
        
        return res.status(200).json({"message": "reset success"})
    }

    
}

export default Reset;