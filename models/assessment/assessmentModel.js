const db = require('../../utils/database');


module.exports = class Assessment{
    constructor(id,student_id,score){
        this.id=id;
        this.student_id=student_id;
        this.score=score;
    }

    save(){
        if(this.id){
            return db.execute(`UPDATE assessment_tbl SET student_id="${this.student_id}", score="${this.score}" WHERE id=?`,[this.id])
        }else{
            return db.execute("INSERT INTO assessment_tbl(student_id,score) VALUES(?,?)",[this.student_id,this.score]);
        }
    }

    static fetchAll(){
        return db.execute("SELECT am.id,am.score,st.name,st.clas,st.nik,st.gender,st.address,st.image FROM assessment_tbl am JOIN student_tbl st ON am.student_id=st.id");
    }

    static findById(id){
        return db.execute(`SELECT am.id,am.score,st.name,st.clas,st.nik,st.gender,st.address,st.image FROM assessment_tbl am JOIN student_tbl st ON am.student_id=st.id WHERE am.id=?`,[id]);
    }

    static deleteById(id){
        return db.execute("DELETE FROM assessment_tbl where id=?",[id]);
    }

    
}