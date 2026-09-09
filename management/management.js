const SVG = {
  edit: `<img src="../images/Edit.svg">`,
  attendance: `<img src="../images/attendance.svg" class="attendanceIcon">`,
  absence: `<img src="../images/absence.svg" class="absenceIcon">`
};

const completePopup = document.querySelector("#completePopup");
const cancelPopup = document.querySelector("#cancelPopup");
const editButtonContainer = document.querySelector(".editButtonContainer");
const completeMessage = document.querySelector("#completeMessage");
const renderEditButton = () => {
  editButtonContainer.innerHTML = `<button class="editButton">${SVG.edit} 출결 수정</button>`;
};

editButtonContainer.addEventListener("click", (e) => {
  if (e.target.closest(".editButton")) onClickEdit();
  if (e.target.closest(".completeButton")) completePopup?.classList.add("active");
  if (e.target.closest(".deleteButton")) cancelPopup?.classList.add("active");
});

completePopup?.querySelector(".cancelButton")?.addEventListener("click", () => completePopup.classList.remove("active"));
cancelPopup?.querySelector(".cancelButton")?.addEventListener("click", () => cancelPopup.classList.remove("active"));

const onClickEdit = () => {
  editButtonContainer.innerHTML = `
    <button class="completeButton">수정완료</button>
    <button class="deleteButton">수정취소</button>
  `;

  const blocks = document.querySelectorAll(".attendanceBlock, .absenceBlock, .inputBlock");
  blocks.forEach((block, index) => {
    const isAttendance = block.classList.contains("attendanceBlock");
    block.className = "inputBlock";

    block.innerHTML = `
      <input type="radio" value="attendance" name="attendance_${index}" id="att_${index}" class="attendanceCheckbox" ${isAttendance ? "checked" : ""}>
      <label for="att_${index}" class="attendanceLabel">출석</label>
      <input type="radio" value="absence" name="attendance_${index}" id="abs_${index}" class="attendanceCheckbox" ${!isAttendance ? "checked" : ""}>
      <label for="abs_${index}" class="absenceLabel">결석</label>
    `;
  });
};

const onCompleteConfirm = () => {
  completePopup.classList.remove("active");
  renderEditButton();

  document.querySelectorAll(".inputBlock").forEach((block) => {
    const checkedRadio = block.querySelector('input[type="radio"]:checked');
    const isAttendance = checkedRadio?.value === "attendance";

    block.className = isAttendance ? "attendanceBlock" : "absenceBlock";
    block.innerHTML = isAttendance ? `${SVG.attendance} 출석` : `${SVG.absence} 결석`;
  });
  completeMessage.classList.add("active");
  setTimeout(()=>{
    completeMessage.classList.remove("active");
    completeMessage.classList.add("closing");
  },3000)
  setTimeout(()=>completeMessage.classList.remove("closing"),4000)
};

const onCancelConfirm = () => {
  cancelPopup.classList.remove("active");
  renderEditButton();

  document.querySelectorAll(".inputBlock").forEach((block) => {
    const checkedRadio = block.querySelector('input[type="radio"]:checked');
    const isAttendance = checkedRadio?.value === "attendance";

    block.className = isAttendance ? "attendanceBlock" : "absenceBlock";
    block.innerHTML = isAttendance ? `${SVG.attendance} 출석` : `${SVG.absence} 결석`;
  });
};

completePopup?.querySelector(".confirmButton")?.addEventListener("click", onCompleteConfirm);
cancelPopup?.querySelector(".confirmButton")?.addEventListener("click", onCancelConfirm);

const checkClass = document.querySelector(".checkClass");
checkClass.innerHTML=`<h3>반별조회</h3>
        <div class="floor" id="classFloor">
            <input type="radio" name="classFloor" checked id="classFloor2" class="btn-checkbox">
            <label for="classFloor2" class="floorLabel">2층</label>
            <input type="radio" name="classFloor" id="classFloor3" class="btn-checkbox">
            <label for="classFloor3" class="floorLabel">3층</label>
        </div>
        <div class="checkWrap">
            <div class="checkBlock">
                <div class="checkHead">1-1</div>
                <div class="checkInfo">출석 12명 · 결석 6명</div>
            </div>
            <div class="checkBlock">
                <div class="checkHead">1-2</div>
                <div class="checkInfo">출석 12명 · 결석 6명</div>
            </div>
            <div class="checkBlock">
                <div class="checkHead">1-3</div>
                <div class="checkInfo">출석 12명 · 결석 6명</div>
            </div>
        </div>`
const checkRoom = document.querySelector(".checkRoom");
checkRoom.innerHTML=`<div class="check" id="checkRoom">
        <h3>실별조회</h3>
        <div class="floor" id="roomFloor">
            <input type="radio" name="roomFloor" checked id="roomFloor1" class="btn-checkbox">
            <label for="roomFloor1" class="floorLabel">1층</label>
            <input type="radio" name="roomFloor" id="roomFloor2" class="btn-checkbox">
            <label for="roomFloor2" class="floorLabel">2층</label>
            <input type="radio" name="roomFloor" id="roomFloor3" class="btn-checkbox">
            <label for="roomFloor3" class="floorLabel">3층</label>
        </div>
        <div class="checkWrap">
            <div class="checkBlock">
                <div class="checkHead">LAB 1실</div>
                <div class="checkInfo">출석 5명 · 결석 3명</div>
            </div>
            <div class="checkBlock">
                <div class="checkHead">LAB 2실</div>
                <div class="checkInfo">출석 5명 · 결석 0명</div>
            </div>
        </div>   
    </div>`