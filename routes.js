const fs = require('fs');

const RequestHandler = (req,res,next)=>{
    const url = req.url;
    const method = req.method;
    if(url=='/'){
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>')
        res.write('<head><title>Belajar nodejs</title></head>')
        res.write('<body><form method="POST" action="/pesan"> <input type="text" name="pesan"> <button type="submit">kirim</button> </form></body>')
        res.write('</html>');
        return res.end();
    }
    if(url == '/pesan' && method == 'POST'){
        const body=[];
        req.on('data',(chunk) => { 
            body.push(chunk);
            console.log(chunk);
            console.log(body);
        })
        req.on('end',()=>{
            const parsebody = Buffer.concat(body).toString();
            console.log(parsebody);
            const pesan = parsebody.split('=')[1];
            console.log(pesan);
            fs.writeFileSync('pesan.text',pesan,err =>{
                res.statusCode=302;
                res.setHeader('Location','/')
                return res.end();
            });
        })
    }
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>')
    res.write('<head><title>Belajar nodejs</title></head>')
    res.write('</html>');
    return res.end();
}

module.exports={
    handler : RequestHandler
}