const fs = require('fs');

//helper buat delete file yg diupload dari form
const deletefile=(filePath)=>{
    if(fs.existsSync(filePath)==true){
        fs.unlink(filePath,(err)=>{
            if(err){
                throw (err);
            }
        })
    }
    
}

exports.deletefile=deletefile;