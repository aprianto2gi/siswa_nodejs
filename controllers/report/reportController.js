const PDFDocument = require('pdfkit');
const fs = require('fs');

exports.getReport= (req,res,next)=> {
    let doc= new PDFDocument({
        margin: 50
    });
    //load data assessment
    let invoicename="Report Student";
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 
        'inline; filename="'+ invoicename +'"'
    );
    doc.pipe(res);
    doc.end();
}