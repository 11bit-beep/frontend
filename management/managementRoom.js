import {SERVER_URL} from '../env.js';
const tBody = document.querySelector(".tBody");
const absenceAttendanceInfo = document.getElementById("absenceAttendanceInfo");
const classChoice = document.getElementById("classChoice");
const beforePageButton = document.getElementById("beforePageButton");
const afterPageButton = document.getElementById("afterPageButton");
const pageNumber = document.getElementById("pageNumber");
const YOUR_ACCESS_TOKEN = await getToken()
async  function getToken(){
    const server_url = `${SERVER_URL}api/auth/login`;
    const postData = {
  "username": "abc1234!",
  "password": "abcdef12345!!"
        }
    try{
        const response = await fetch(server_url,{
            method:"POST",
            headers: {
            'Content-Type': 'application/json',
            },
            body:JSON.stringify(postData)
        })
        const data= await response.json();
        return data.accessToken
    }catch(error){
        console.error(error)
    }
}


async function getServerData(place,date) {
    const server_url = `${SERVER_URL}api/attendance/places/${place}?date=${date}`;
    try{
        const response = await fetch(server_url,{
    method: "GET",
    headers: {
        'Content-Type': "application/json",
        'Authorization':`Bearer ${YOUR_ACCESS_TOKEN}`
    }});
        if (!response.ok) {
        throw new Error(`서버 에러 발생: ${response.status}`);
        }
        const data = await response.json()
        return data;
    }catch(error){
        console.error("데이터를 가져오는 중 오류가 발생했습니다:", error);
    }
}
async function checkClass(grade,studentClass,date){
    const data = await getServerData(grade,studentClass,date);
    if(data){
        tBody.innerHTML="";
        absenceAttendanceInfo.innerHTML=`출석 ${data.attendedCount}명 · 결석 ${data.absentCount}명`
        data.students.forEach(student => {
            const studentInfo = document.createElement("div");
            studentInfo.className='tr'
            studentInfo.innerHTML=`
                        <div>${student.grade}${student.studentClass}${student.number}</div>
                        <div>${student.name}</div>
                        <div class="${student.status=="ABSENT"?"attendanceBlock":"absenceBlock"}">
                            <img src=${student.status=="ABSENT"?"../images/attendance.svg":"../images/absence.svg"}
                            class=${student.status=="ABSENT"?"attendanceIcon":"absenceIcon"}>
                            ${student.status=="ABSENT"?"출석":"결석"}
                        </div>
            `
            tBody.appendChild(studentInfo);
        });
    }
}
classChoice.addEventListener('change',e=>{
    const selectedValue = e.target.value;
    const studentGrade =selectedValue.split(".")[0]
    const studentClass = selectedValue.split(".")[1];
    checkClass(studentGrade,studentClass,new Date().toISOString().split("T")[0]);
})
checkClass("lab1",new Date().toISOString().split("T")[0]);
