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
        if(this.id){
            return db.execute(`UPDATE student_tbl SET name="${this.name}",clas="${this.clas}",nik="${this.nik}",image="${this.image}",gender="${this.gender}",address="${this.address}" WHERE id="${this.id}" `)
        }else{
            return db.execute('INSERT INTO student_tbl (name,clas,nik,image,gender,address) VALUES (?,?,?,?,?,?)',[this.name,this.clas,this.nik,this.image,this.gender,this.address]);
        }
    }

    static fetchAll(){
        return db.execute("SELECT * FROM student_tbl");
    }

    static FindById(id){
        return db.execute("SELECT * FROM student_tbl WHERE id=?",[id]);
    }

    static deleteStudent(id){
        return db.execute("DELETE FROM student_tbl WHERE id=?",[id]);
    }
}