const checkClass = document.querySelector("#checkClass .checkWrap");
import {SERVER_URL} from '../env.js';
const checkRoom = document.querySelector("#checkRoom .checkWrap");
const today = new Date().toISOString().split("T")[0];
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
                <div class="checkInfo">출석 ${students.attendedCount}명 · 결석 3명</div>`;
        checkRoom.appendChild(placeDiv);
    })
}
loadPage();