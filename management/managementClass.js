import {SERVER_URL} from '../env.js';
const tBody = document.querySelector(".tBody");
const absenceAttendanceInfo = document.getElementById("absenceAttendanceInfo");
const classChoice = document.getElementById("classChoice");
const today = new Date().toISOString().split("T")[0]
const dateInput = document.getElementById("dateInput");
dateInput.value=today
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


async function getServerData(grade,studentClass,date) {
    const server_url = `${SERVER_URL}api/attendance/classes/${grade}/${studentClass}?date=${date}`;
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
        console.log(data.students)
        data.students.forEach(student => {
            const studentInfo = document.createElement("div");
            studentInfo.className='tr'
            studentInfo.innerHTML=`
                        <div>${student.grade}${student.studentClass}${student.number}</div>
                        <div>${student.name}</div>
                        <div class="${student.status=="ABSENT"?"absenceBlock":"attendanceBlock"}">
                            <img src=${student.status=="ABSENT"?"../images/absence.svg":"../images/attendance.svg"}
                            class=${student.status=="ABSENT"?"absenceIcon":"attendanceIcon"}>
                            ${student.status=="ABSENT"?"결석":"출석"}
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
    checkClass(studentGrade,studentClass,dateInput.value);
})
dateInput.addEventListener('change',e=>{
    const selectedValue = classChoice.value;
    const studentGrade =selectedValue.split(".")[0]
    const studentClass = selectedValue.split(".")[1];
    checkClass(studentGrade,studentClass,dateInput.value);
})
checkClass(1,1,today);
