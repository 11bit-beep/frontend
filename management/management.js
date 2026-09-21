const checkClass = document.querySelector("#checkClass .checkWrap");
import {SERVER_URL} from '../env.js';
const checkRoom = document.querySelector("#checkRoom .checkWrap");
const today = new Date().toISOString().split("T")[0];
const YOUR_ACCESS_TOKEN = await getToken()
async  function getToken(){
    const token = sessionStorage.getItem("accessToken");
    if(token){
        return token
    }
    console.error("토큰이 존재하지 않습니다.")
}
async function getServerDate(){
    const server_url = `${SERVER_URL}api/attendance/summary?date=${today}`
    try{
        const response = await fetch(server_url,{
            method:"GET",
            headers:{
                'Content-type':'application/json',
                'Authorization':`Bearer ${YOUR_ACCESS_TOKEN}`
            }
        })
        if(!response.ok){
        throw new Error(`서버 에러 발생: ${response.status}`);
        }
        const data = await response.json();
        return data
    }catch(error){
        console.error("에러 : "+error)
    }
}
async function loadPage(){
    const data = await getServerDate();
    checkClass.innerHTML="";
    data.classes.forEach(students => {
        const studentsDiv = document.createElement("div");
        studentsDiv.className="checkBlock";
        studentsDiv.innerHTML=`
        <div class="checkHead">${students.grade}-${students.studentClass}</div>
        <div class="checkInfo">출석 ${students.attendedCount}명 · 결석 ${students.absentCount}명</div>`;
        checkClass.appendChild(studentsDiv);
    });
    checkRoom.innerHTML="";
    data.places.forEach(students=>{
        const placeDiv = document.createElement("div");
        placeDiv.className="checkBlock";
        placeDiv.innerHTML=`<div class="checkHead">${students.place}</div>
                <div class="checkInfo">출석 ${students.attendedCount}명</div>`;
        checkRoom.appendChild(placeDiv);
    })
}
loadPage();