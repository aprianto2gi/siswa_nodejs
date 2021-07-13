const path = require('path');
const fs = require('fs');
const db= require('../../utils/database');
const { get } = require('http');

const p = path.join(path.dirname(process.mainModule.filename),
    'data',
    'student.json'
);

const getStudentFromFile = call =>{
    fs.readFile(p,(err,fileContent)=>{
        if(err){
            call([]);
        }
        call(JSON.parse(fileContent));
    })
}

module.exports =class Student{
    constructor(id,name,clas,nik,image,gender,address){
        this.id=id
        this.name=name
        this.clas=clas
        this.nik=nik
        this.image=image
        this.gender=gender
        this.address=address
    }

    save(){
        getStudentFromFile(student=>{
            if(this.id){
                const studentIndex= student.findIndex(stud=> stud.id === this.id);
                const updateStudent= [...student];
                updateStudent[studentIndex]=this;
                fs.writeFile(p,JSON.stringify(updateStudent),(err)=>{
                    console.log(err);
                })
            }else{
                this.id= Math.random().toString();
                student.push(this);
                fs.writeFile(p,JSON.stringify(student),(err)=>{
                    console.log(err);
                })  
            }
        })
    }

    // static fetchAll(call){
    //     getStudentFromFile(call);
    // }
    static fetchAll(){
        return db.execute("SELECT * FROM student_tbl");
    }

    static FindById(id,call){
        getStudentFromFile(student=>{
            const students= student.find(p => p.id === id);
            call(students);
        })
    }

    static deleteStudent(id){
        getStudentFromFile(student=>{
            const studentDelete = student.filter(stud => stud.id !== id);
            fs.writeFile(p,JSON.stringify(studentDelete),(err)=>{
                console.log(err);
            })
        })
    }
}