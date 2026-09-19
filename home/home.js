import { API_BASE_URL } from '../env.js';
const ACCESS_TOKEN_KEY = 'accessToken';

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
  const recentAttendanceBody = document.getElementById('recent-attendance-body');
  let member;
  let isCheckedIn = false;

  function openModal(modal) { modal?.classList.remove('hidden'); }
  function closeModal(modal) { modal?.classList.add('hidden'); }

  async function request(path, options = {}) {
    const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!accessToken) throw new Error('로그인 토큰이 없습니다. 다시 로그인해주세요.');

    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
        ...options.headers,
      },
    });

    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
    }
    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const error = new Error(errorBody.message || errorBody.error || '요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.');
      error.status = response.status;
      throw error;
    }
    return response.json();
  }

  function setAttendanceState(checkedIn) {
    isCheckedIn = checkedIn;
    attendanceContainer.classList.toggle('checked-in', checkedIn);
    attendanceTitle.textContent = checkedIn ? '현재 출석 중입니다.' : '오늘 출석체크를 하셨나요?';
    attendanceWarning.textContent = checkedIn
      ? '퇴실시 반드시 퇴실하기 버튼을 눌러주세요.'
      : '오늘 야간자율학습 출석은 07:40까지 입니다.';
    btnAttendanceAction.textContent = checkedIn ? '퇴실하기' : '출석하기';
  }

  function formatDate(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('.');
  }

  function dateOffset(offset) {
    const date = new Date();
    date.setDate(date.getDate() - offset);
    return date;
  }

  function toApiDate(date) {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
  }
  function dayName(date) { return ['일', '월', '화', '수', '목', '금', '토'][date.getDay()]; }

  function attendanceRow(date, record) {
    const checkedIn = record?.status === 'CHECKED_IN' || record?.status === 'CHECKED_OUT';
    const status = checkedIn ? '출석' : '결석';
    const icon = checkedIn ? 'Yes.svg' : 'No.svg';
    return `<tr class="table-content">
      <td>${formatDate(date)}</td><td>${dayName(date)}</td>
      <td><div class="${checkedIn ? 'check' : 'no'}"><img src="../images/${icon}" alt="${status} 아이콘" /><p>${status}</p></div></td>
      <td>${record?.type || '-'}</td><td>${record?.place || '-'}</td></tr>`;
  }

  async function loadAttendanceHistory() {
    const dates = [0, 1, 2, 3].map(dateOffset);
    const results = await Promise.all(dates.map(async (date) => {
      const data = await request(`/api/attendance/classes/${member.grade}/${member.studentClass}?date=${toApiDate(date)}`);
      return { date, record: data.students?.find((student) => student.memberId === member.id) };
    }));
    recentAttendanceBody.innerHTML = results.map(({ date, record }) => attendanceRow(date, record)).join('');
    setAttendanceState(results[0].record?.status === 'CHECKED_IN');
    return results[0].record;
  }

  function fillProfile(data) {
    document.getElementById('profile-name').textContent = data.name;
    document.getElementById('profile-student-number').textContent = `${data.grade}학년 ${data.studentClass}반 ${data.number}번`;
    document.getElementById('profile-name-input').value = data.name;
    document.getElementById('profile-grade-select').value = data.grade;
    document.getElementById('profile-class-select').value = data.studentClass;
    document.getElementById('profile-number-select').selectedIndex = data.number - 1;
    updateDepartment();
  }

  function departmentFor(grade, studentClass) {
    if (grade === 1) return '공통과정';
    if ((grade === 2 || grade === 3) && studentClass === 4) return '인공지능소프트웨어과';
    return '소프트웨어과';
  }

  function updateDepartment() {
    const grade = Number(document.getElementById('profile-grade-select').value);
    const studentClass = Number(document.getElementById('profile-class-select').value);
    const department = departmentFor(grade, studentClass);
    document.getElementById('profile-department').textContent = department;
    document.getElementById('profile-department-input').textContent = department;
  }

  async function loadHome() {
    try {
      member = await request('/api/members/me');
      fillProfile(member);
      await loadAttendanceHistory();
    } catch (error) {
      recentAttendanceBody.innerHTML = '<tr class="table-content"><td colspan="5">출석 정보를 불러오지 못했습니다.</td></tr>';
      alert(error.message);
    }
  }

  document.querySelectorAll('.modal-background').forEach((modal) => {
    modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(modal); });
    modal.querySelectorAll('.modal-close').forEach((button) => button.addEventListener('click', () => closeModal(modal)));
  });

  btnOpenProfile.addEventListener('click', () => openModal(profileModal));
  btnAttendanceAction.addEventListener('click', () => openModal(isCheckedIn ? checkoutModal : attendanceModal));
  document.getElementById('profile-grade-select').addEventListener('change', updateDepartment);
  document.getElementById('profile-class-select').addEventListener('change', updateDepartment);

  attendanceForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = attendanceForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await request('/api/attendance/check_in', {
        method: 'POST',
        body: JSON.stringify({
          type: document.getElementById('attendance-type-select').value,
          place: document.getElementById('attendance-place-select').value,
        }),
      });
      closeModal(attendanceModal);
      attendanceForm.reset();
      await loadAttendanceHistory();
    } catch (error) {
      let todayRecord;
      try {
        todayRecord = await loadAttendanceHistory();
      } catch (refreshError) {
        console.error('출석 상태를 다시 불러오지 못했습니다.', refreshError);
      }
      const hasTodayAttendance = ['CHECKED_IN', 'CHECKED_OUT'].includes(todayRecord?.status);
      const isDuplicateCheckIn = hasTodayAttendance || error.status === 409 || /duplicate|already|중복|이미.*출석/i.test(error.message);
      if (isDuplicateCheckIn) {
        closeModal(attendanceModal);
        alert('오늘은 이미 출석 처리되었습니다.');
      } else {
        alert(error.message);
      }
    }
    finally { button.disabled = false; }
  });

  checkoutForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = checkoutForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      await request('/api/attendance/check_out', { method: 'PUT' });
      closeModal(checkoutModal);
      await loadAttendanceHistory();
    } catch (error) { alert(error.message); }
    finally { button.disabled = false; }
  });

  profileForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = profileForm.querySelector('button[type="submit"]');
    button.disabled = true;
    try {
      member = await request('/api/members/me', {
        method: 'PUT',
        body: JSON.stringify({
          name: document.getElementById('profile-name-input').value.trim(),
          grade: Number(document.getElementById('profile-grade-select').value),
          studentClass: Number(document.getElementById('profile-class-select').value),
          number: Number(document.getElementById('profile-number-select').selectedIndex + 1),
        }),
      });
      fillProfile(member);
      closeModal(profileModal);
      await loadAttendanceHistory();
    } catch (error) { alert(error.message); }
    finally { button.disabled = false; }
  });

  loadHome();
});
