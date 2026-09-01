document.addEventListener('DOMContentLoaded', () => {
  const profileModal = document.getElementById('profile-edit-modal');
  const attendanceModal = document.getElementById('attendance-check-modal');
  const checkoutModal = document.getElementById('check-out-modal');

  const btnOpenProfile = document.getElementById('btn-open-profile-modal');
  const btnAttendanceAction = document.getElementById('attendance-action-btn');
  const attendanceContainer = document.getElementById('attendance-check-container');
  const attendanceTitle = document.getElementById('attendance-title');
  const attendanceWarning = document.getElementById('attendance-warning');

  const profileForm = document.getElementById('profile-form');
  const attendanceForm = document.getElementById('attendance-form');
  const checkoutForm = document.getElementById('checkout-form');

  let isCheckedIn = false;

  function openModal(modal) {
    if (modal) modal.classList.remove('hidden');
  }

  function closeModal(modal) {
    if (modal) modal.classList.add('hidden');
  }

  document.querySelectorAll('.modal-background').forEach((modal) => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal(modal);
    });

    modal.querySelectorAll('.modal-close').forEach((btn) => {
      btn.addEventListener('click', () => closeModal(modal));
    });
  });

  btnOpenProfile.addEventListener('click', () => {
    openModal(profileModal);
  });

  btnAttendanceAction.addEventListener('click', () => {
    if (!isCheckedIn) {
      openModal(attendanceModal);
    } else {
      openModal(checkoutModal);
    }
  });

  attendanceForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal(attendanceModal);

    isCheckedIn = true;
    attendanceContainer.classList.add('checked-in');
    attendanceTitle.textContent = '현재 출석 중입니다.';
    attendanceWarning.textContent = '퇴실시 반드시 퇴실하기 버튼을 눌러주세요.';
    btnAttendanceAction.textContent = '퇴실하기';
  });

  checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    closeModal(checkoutModal);

    isCheckedIn = false;
    attendanceContainer.classList.remove('checked-in');
    attendanceTitle.textContent = '오늘 출석체크를 하셨나요?';
    attendanceWarning.textContent = '오늘 야간자율학습 출석은 07:40까지 입니다.';
    btnAttendanceAction.textContent = '출석하기';
  });

  profileForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('프로필 수정이 완료되었습니다.');
    closeModal(profileModal);
  });
});
