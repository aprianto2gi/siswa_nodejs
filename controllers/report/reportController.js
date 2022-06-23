const PDFDocument = require('pdfkit');
const assessmentModel = require('../../models/assessment/assessmentModel');
const studentModel = require('../../models/student/studentModel');

const student={
    student:{
        today: new Date(),
        number: Math.floor(Math.random() * 101),
        date: function(){
            return (
                this.today.getDate() + "-"  + (this.today.getMonth() + 1) + "-" + this.today.getFullYear()
            )
        },
        dataassessment: function(){
            return assessmentModel.findAll({
                include:[{
                    model: studentModel,
                    attribute: ['id','name', 'clas', 'gender', 'nik', 'image', 'address']
                }],
                order:[
                    ['id','DESC']
                ]
            })
        }
    }
}

exports.getReport= async (req,res,next)=> {
    let doc= new PDFDocument({
        margin: 50
    });
    //load data assessment
    let dataassessment= await student.student.dataassessment() //load dari ln 14


    let invoicename="Report Student";
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 
        'inline; filename="'+ invoicename +'"'
    );
    generateHeader(doc)
    generateStudentInfo(doc)

    generateInvoiceTable(doc,dataassessment)

    doc.pipe(res);
    doc.end();
}

const generateHeader= (doc)=>{
    doc.image("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAHkAjQMBIgACEQEDEQH/xAAcAAEAAgIDAQAAAAAAAAAAAAAABQcEBgECAwj/xAA8EAABAwMBBQUFBAoDAQAAAAABAAIDBAURIQYSMUFxE1FhgZEiMqHB0RUjseEHFDNCUmJygpKiNEPwJP/EABoBAQEBAQEBAQAAAAAAAAAAAAAFBAIDBgH/xAAkEQEAAgIABgIDAQAAAAAAAAAAAQMCBBESITFBURMiIzLRBf/aAAwDAQACEQMRAD8AvFERAREQEREBERARcLlAREQEREBERAREQEREBERARFCbRX1lqiEcYD6qQey08GjvK4ssxrxnLLs7rrysyjHHukLhcaW3x79VKGZ4DiT0C1yr2weSRR0wA/ilPyH1WvQRVt5rTu7007tXPcdGjx7gtqt+ydNG0OrXumfza32W/VSpv2tmfw9I9qc6+trR+WeOXpEHaW5uORNG3pGPmvaDae4M/adlIPFmPwWyttFtjGBQ0/UsB/FdJrFbZm/8VkZ74xu/gvydTcjrFnVxOzqz0+NjW7aOCqe2KdnYSHQEnLSeqnAVo97szrbuysdv07jjLhq09xUzabo9mz89VK0yupGuLhnVwaM+uF66e1bNk0Xx9njsUV8kW1dmwIsehrIK6liqaZ4fFKMtcshVGIREQEREBERARFwUGPcKuOiopqmT3Y2k47+4KtWCpvV0/inqH69zR9AFs231WWUdPSg/tXl7ujfzIXnsDRjcqK1wySeyYT3cT8lL2Y+fYinxHdY1eGvq5X+Z6Q2S126G20rYIG8NXO5uPeVmJkBYNyu1Hbmj9ZlAceDG6uPkqH0qx69IhK+1mXuZajtVVTTXWWCQnsosBrOWoBys7Y+tka+eCWT/AOdjN8Fx0Zrj/wB0UZfLtBc5Q9lJ2bmjHaF2pHRYNLT1NUTHTRSSZ4hg08+S+em6cNqbMJ5l34Iy1owzjlT20l7iq2ilpdYw7LpOTvAeC9paWopNia4Rxl0s0TnObzDSMH0bkr1s2zXZPbPcN1zhq2JpyAfHvU7SVUVY2QwnfjY8x73JxHHHeM6eRVPUotytm+7v4hN2ba8cIpq7R3lX+wF4NHcPs+U/cVLvZ10bJ+fD0VlKm79Sm0X6phhJaIpQ+LwBw5vp8lblvqG1dDT1LeEsbX+oyqTCyEREBERAREQFwVyuCg0P9ILj9o0g5CEn4qe2JaBs/ERxL3k/5EKI/SJAc0VSBp7UZPoR81mbAVQktktOSN6GQkDwOv45UzDpu5cfKxb9v87Hh4n+pW+3F9vph2DDJVTHchYBnJ78dwUHRbK1FU81F3qHCR5yWNOXeZ+ik9pr3b7DGyqqm9pVOaWwRt953DPQcMlV1XbUX2/VIghlljDz7NPR5B8yNT+Hgteevjblxs6x68J9exlVjwr6T78rG+z9n7aAJxSxkc6iQE/7FedTtXYqJu6ypbIRwZTsLvy+K0mg2DvNTh9QIKUO1Pav3neg+q2e2bA0NOQ+unkqnD90ewz4a/FeuNeGH6xweOWeWf7TxYxvN12pmdR2qJ1JScJZydQ3ry6DXxW40FHDQUcNLTt3YomhrQu9NTw0sLYaaJkUTeDGNwB5L1XblVv6RwG7SAge9TMJ9XD5LedjnF2zNvLuPZY9CQq224rW1e01Y5h3mxYiH9o1+OVadgpjR2Shp3DDo4GB3XGvxQZ6IiAiIgIiICIiCK2kt32naJoGD7wDfj/qHD14ea1HYPejuVVI95ZHFATID159MFWE7ULWL/bWUFuv9fTeyamidvt/mAOSOuVmso5rcbI8NlO1yUZ0z57K3llrdstp3GH36h5EYOcRRDhnoPifFW5YLFRWKkENJGN8j7yZw9qQ+J+Sp3YvaiPZy7vfPSiaCaPcke3349c+zyPiPAK5rRebdeIBNbauKduNWtOHN6t4jzWljSCInJAUJtZfY7FanzbwNTIC2nYebu/oOJ/NYm0O2lrs7XxslbV1Y0EMTs4P8zuA/HwVX1VXdNqbwC5pnqpTuxxsGGsHcO4DmUGbshbH3q/wseC6KN3bVDjroNcHqdPVXQFC7KWCKwW4Qgh9RJ7U8gHvO7h4DkptAREQEREBERAREQFi3OlFbbqqlPCeF8fqCFlIgp+y7BNvuzENbT1Bp7kHyxytk1jeWvIwebTpy9Fr9fsxtBZZS+WgqW7p0npsvHUFuo88K8rVQC3/AK2yMARS1L52Aci/Bd/tvHzWcg+f4tqr/Tt7Nt3rABye/eI/y1SS6327ns3Vlwq8/wDWxz3A/wBrfor9dFG85fGxx8Wgrs1rWjDWgDuAQU1ZdgL1Xua6qjbQU/8AFNq8jwaPnhWds9s5b7BT7lFGTK4feTv1e/6DwGimEQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERBGirre3waP7oP3Sc64yfaHfoB5leTK24lzN6hAD93IJPs5znOh8PXqpU8SnNBGPrK8YxRDlnBJ4tJ+B0XeOrrTLFv0ZYw57TXJboMdeazjxHRduSCONXXEgNockjm4jBzju7tfNZEM1S6KIvpgHOfiQb/uNwdfHlp4rJ7+qFBFS1VzbK5sdKHtD5MOAxkfu/PPTRBU3Lew6nw07ga7cznJOSQDkaY6eekp+6P6Vy7iOoQQoq7v2eTSM38cN048efLTryypGglqJBJ+ss3CC3d9nGhaM9dchZKDiUHZERAREQf//Z",50,45,{
        width:50
    })
    .fillColor("#444444")
    .fontSize(20)     //utk size school / berpengaruh ke text setelah font size
    .text("School",100,57)
    .fontSize(10)           //utk size jakarta & text setelah fontsize
    .text("Jakarta",200,65,{
        align:"right"
    })
    .text("Bandung, Yogyakarta, 1994",200,80,{
        align:"right"
    })
    .moveDown()
}

const generateStudentInfo= doc=>{
    generateHr(doc,110)
    doc.text(`Report Number: ${student.student.number}`,50,120) //50=x , 120=y
        .text(`Report Date: ${student.student.date()}`,50,145)
        .text(`University: ABC`,400,120)
        .text("Address: Jakarta, Indonesia", 400,145)
        .moveDown()
    generateHr(doc,175)
}

const generateHr=(doc,y)=>{
    doc.strokeColor("#aaaaaa")
        .lineWidth(1)
        .moveTo(10,y)
        .lineTo(600,y)
        .stroke()
}

const generateInvoiceTable=(doc,dataassessment)=>{
    let i;
    const invoiceTableTop=230;
    doc.font("Helvetica-Bold")
    generateTableRow(doc,
                        invoiceTableTop,
                        "id",
                        "clas",
                        "nik",
                        "gender",
                        "name",
                        "score"
                    )
    generateHr(doc,invoiceTableTop+20);
    doc.font("Helvetica");
    for(i=0; i < dataassessment.length; i++) {
        const item= dataassessment[i];
        const position= invoiceTableTop + (i + 1)*30
        generateTableRow(doc, position, item.student_tbl.id, item.student_tbl.clas, item.student_tbl.nik, item.student_tbl.gender, item.student_tbl.name, item.score);
        generateHr(doc, position + 20);
    }
    
}

const generateTableRow= (doc,y,id,clas,nik,gender,name,score)=>{
    doc
        .fontSize(10)
        .text(id,50,y)
        .text(clas,150,y)
        .text(nik,250,y,{
            width:90
        })
        .text(gender,320,y,{
            width:90
        })
        .text(name,400,y,{
            width:50,
            height:50
        })
        .text(score,450,y,{
            width:90,
            align: 'right'
        })
}