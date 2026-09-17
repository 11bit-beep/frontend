import SERVER_URL from '../env'
const tBody = document.querySelector(".tBody");
async function getServerData(grade,studentClass,date) {
    const server_url = `${SERVER_URL}GET/api/attendance/classes/${grade}/${studentClass}`;
    try{
        const response = await fetch(server_url);
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

}