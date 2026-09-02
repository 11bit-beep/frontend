const SVG = {
  edit: `<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.292 7.94836L14.0507 4.70794M8.21703 17.0224L18.5882 6.65219C18.9319 6.30839 19.125 5.84216 19.125 5.35602C19.125 4.86989 18.9319 4.40366 18.5882 4.05986L17.9401 3.41177C17.5963 3.06808 17.1301 2.875 16.6439 2.875C16.1578 2.875 15.6916 3.06808 15.3478 3.41177L4.97661 13.7829L4.00494 17.9959L8.21703 17.0224Z" stroke="#555555" stroke-width="1.66667" stroke-linejoin="round"/></svg>`,
  attendance: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="17.5" height="17.5" rx="8.75" fill="#0052FF"/><path fill-rule="evenodd" clip-rule="evenodd" d="M13.7219 5.16162C13.8683 5.30812 13.9506 5.5068 13.9506 5.71396C13.9506 5.92112 13.8683 6.1198 13.7219 6.2663L7.86614 12.122C7.78875 12.1994 7.69688 12.2608 7.59576 12.3027C7.49465 12.3446 7.38627 12.3662 7.27682 12.3662C7.16737 12.3662 7.05899 12.3446 6.95787 12.3027C6.85675 12.2608 6.76488 12.1994 6.68749 12.122L3.77812 9.21318C3.7035 9.14111 3.64398 9.0549 3.60304 8.95959C3.56209 8.86427 3.54054 8.76176 3.53964 8.65802C3.53874 8.55429 3.55851 8.45142 3.59779 8.3554C3.63707 8.25939 3.69508 8.17216 3.76843 8.09881C3.84179 8.02545 3.92902 7.96744 4.02503 7.92816C4.12104 7.88888 4.22392 7.86911 4.32765 7.87001C4.43138 7.87092 4.5339 7.89247 4.62922 7.93341C4.72453 7.97436 4.81074 8.03387 4.88281 8.10849L7.27656 10.5022L12.6167 5.16162C12.6892 5.08902 12.7754 5.03143 12.8702 4.99213C12.965 4.95284 13.0666 4.93262 13.1693 4.93262C13.2719 4.93262 13.3735 4.95284 13.4684 4.99213C13.5632 5.03143 13.6493 5.08902 13.7219 5.16162Z" fill="#E3ECFF"/></svg>`,
  absence: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="17.5" height="17.5" rx="8.75" fill="#D82B2B"/><path d="M9.71703 8.74604L13.0504 5.41263C13.1745 5.28416 13.2432 5.11209 13.2416 4.93348C13.2401 4.75488 13.1684 4.58403 13.0421 4.45774C12.9159 4.33144 12.745 4.2598 12.5664 4.25825C12.3878 4.2567 12.2158 4.32536 12.0873 4.44944L8.75393 7.78286L5.42079 4.44944C5.29306 4.32174 5.11985 4.25 4.93924 4.25C4.75863 4.25 4.58542 4.32174 4.45769 4.44944C4.33 4.57718 4.25827 4.75041 4.25827 4.93103C4.25827 5.11166 4.33 5.28489 4.45769 5.41263L7.79082 8.74604L4.45006 12.0874C4.3546 12.1825 4.28956 12.3039 4.26317 12.4361C4.23678 12.5683 4.25024 12.7054 4.30183 12.8299C4.35343 12.9544 4.44084 13.0608 4.55299 13.1356C4.66513 13.2104 4.79696 13.2502 4.93175 13.25C5.10612 13.25 5.28048 13.1835 5.41344 13.0505L8.7542 9.70923L12.0873 13.0426C12.1506 13.1059 12.2257 13.1561 12.3083 13.1903C12.391 13.2245 12.4796 13.2421 12.569 13.2421C12.7037 13.2421 12.8353 13.2021 12.9473 13.1273C13.0593 13.0524 13.1466 12.9461 13.1981 12.8217C13.2497 12.6972 13.2632 12.5603 13.2369 12.4282C13.2107 12.2961 13.1459 12.1747 13.0507 12.0795L9.71703 8.74604Z" fill="#FFE2E2"/></svg>`
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