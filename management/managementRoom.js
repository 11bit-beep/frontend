const managementTable = document.querySelector("#managementTable");
managementTable.innerHTML=`<div id="managementTable">
                <div class="thead">
                    <div class="tr">
                        <div>학번</div>
                        <div>이름</div>
                        <div>상태</div>
                    </div>
                </div>
                <div>
                    <div class="tr">
                        <div>1102</div>
                        <div>우희린</div>
                        <div class="absenceBlock">
                            <img src="../images/absence.svg" class="absenceIcon">
                            결석
                        </div>
                    </div>
                    <div class="tr">
                        <div>1102</div>
                        <div>우희린</div>
                        <div class="attendanceBlock">
                            <img src="../images/attendance.svg" class="attendanceIcon">
                            출석
                        </div>
                    </div>
                </div>
            </div>`
const detailHead = document.querySelector(".detailHead")
detailHead.innerHTML=`<div class="detailHead">
                <h3>반별 상세 조회</h3>
                <a id="backButton" href="management.html">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.75 9H14.25M8.25 4.5L3.75 9L8.25 13.5" stroke="#555555" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    뒤로가기
                </a>
            </div>`
const checkDetailContainer = document.querySelector(".checkDetailContainer")
checkDetailContainer.innerHTML=`<div class="checkDetailContainer">
                <select name="classChoice" id="">
                    <option value="1.1">1-1</option>
                    <option value="1.2">1-2</option>
                    <option value="1.3">1-3</option>
                </select>
                <div>출석 12명 · 결석 6명</div>
                <div class="editButtonContainer">
                    <button class="editButton">
                        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.292 7.94836L14.0507 4.70794M8.21703 17.0224L18.5882 6.65219C18.9319 6.30839 19.125 5.84216 19.125 5.35602C19.125 4.86989 18.9319 4.40366 18.5882 4.05986L17.9401 3.41177C17.5963 3.06808 17.1301 2.875 16.6439 2.875C16.1578 2.875 15.6916 3.06808 15.3478 3.41177L4.97661 13.7829L4.00494 17.9959L8.21703 17.0224Z" stroke="#555555" stroke-width="1.66667" stroke-linejoin="round"/></svg>
                        출결 수정
                    </button>
                </div>
            </div>`