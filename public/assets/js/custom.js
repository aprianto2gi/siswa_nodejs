const globalvar={
  url: `http://localhost:5000/`
}
const deletestudent=(btn)=>{
    const id=btn.parentNode.querySelector('[name=id]').value; //parentNode akan mengambil nilai yg ad di dalam div(bungkus) yg sama
    const csrf=btn.parentNode.querySelector('[name=_csrf]').value;
    const studentElement=btn.closest('tr');
    let student=document.getElementById('table'); //id table student list
    let parent= student.parentNode;
    let helper= document.createElement('div');
    fetch('/student-delete/' + id,{
        method: 'delete',
        headers:{
            'csrf-token': csrf,
        }
    }).then((result) => {
        return result.json()
    }).then((data)=>{
        studentElement.parentNode.removeChild(studentElement); //menghapus 1 tr di tampilan
        helper.innerHTML=   `<div id="message" class="alert alert-info" role="alert">
                                ${data.message}
                            </div>`;
        
        parent.insertBefore(helper.firstChild,student)
        removeElement()
        
    }).catch((err) => {
        console.log(err);
    });
}

const removeElement=()=>{
    setTimeout(()=>{
        const element= document.getElementById('message');
        element.parentNode.removeChild(element);
    },2000);
}

const assessment= io.connect(globalvar.url);
    assessment.on('assessment', data=> {
      let table= document.getElementById('table');
      //let parent= table.parentNode;
      let tablerow= document.createElement('tr');
      tablerow.innerHTML=`<td class="middle">
            <div class="media">
                <div class="media-left">
                    <a href="#">
                        <img class="media-object"
                            src="${data.assessment.student_tbl.image}"
                            height="100px" width="100px" alt="...">
                    </a>
                </div>
            <div class="media-body">
                <address>
                        Class : ${data.assessment.student_tbl.clas}<br>
                        Name Student : ${data.assessment.student_tbl.name}<br>
                        Gender :  ${data.assessment.student_tbl.gender}<br>
                        Nik : ${data.assessment.student_tbl.nik}
                </address>
            </div>
            <div class="media-body">
                <address>
                        Score : ${data.assessment.score}
                </address>
            </div>
        </div>
      </td>
      <td width="100" class="middle">
            <div>
                <a href="/assessment-edit/${data.assessment.id}?edit=true" class="btn btn-circle btn-default btn-xs" title="Edit">
                    <i class="fas fa-pencil-alt"></i>
                </a>
            </div>
        </td>`;
      table.insertAdjacentElement('afterbegin',tablerow);
    });

const socket= io.connect(globalvar.url);
    socket.on('create', data=> { //'create' sesuaikan dgn controller bagian emit
        if(data.action === 'create'){
            let table= document.getElementById('table');
            //let parent= table.parentNode;
            let tablerow= document.createElement('tr');
            tablerow.innerHTML=`<td class="middle">
            <div class="media">
              <div class="media-left">
                <a href="#">
                  <img class="media-object" src="${data.student.image}" height="100px" width="100px" alt="...">
                </a>
              </div>
              <div class="media-body">
                <address>
                    <b>Name Student</b>          :  ${data.student.name}<br>
                    <b>Gender</b>                :  ${data.student.gender}<br>
                    <b> Address </b>             :  ${data.student.address}<br>
                    <b> Class </b>               :  ${data.student.clas}<br>
                    <b> Nik </b>                 :  ${data.student.nik}
                </address>
              </div>
            </div>
          </td>
          <td width="100" class="middle">
            <div>
              <a href="/student-list/${data.student.id}?edit=true" class="btn btn-circle btn-default btn-xs" title="Edit">
                <i class="fas fa-pencil-alt"></i>
              </a>
              </a>
                </div>
        </td>`;
        table.insertAdjacentElement('afterbegin',tablerow);
        }
    });

  
