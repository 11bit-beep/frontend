import { SERVER_URL } from '../../env.js';

const form = document.querySelector('form');
const nameInput = document.querySelector('#user-name');
const idInput = document.querySelector('#user-id');
const pwInput = document.querySelector('#pw-input');
const pwConfirmInput = document.querySelector('#pw-confirm-input');
const gradeSelect = document.querySelector('#grade');
const classSelect = document.querySelector('#student-class');
const numberSelect = document.querySelector('#student-number');
const selects = document.querySelectorAll('select');
const submitBtn = document.querySelector('button[type="submit"]');
const errorMsg = document.querySelector('.error-msg');
const fields = [nameInput, idInput, pwInput, pwConfirmInput, ...selects];
let isSubmitting = false;

// 비번 보기(눈알) 버튼 활성화 여부
function toggleEyeIcon(input) {
  const toggleBtn = input.parentElement.querySelector('.pw-toggle');
  if (!toggleBtn) return;

  if (input.value.length > 0) {
    toggleBtn.style.display = 'flex';
  } else {
    toggleBtn.style.display = 'none';
  }
}


// 입력 확인 + 회원가입 버튼 활성화 여부
function checkForm() {
  const isNameValid = nameInput.value.trim() !== '';
  const isIdValid = idInput.value.trim() !== '';
  const isPwValid = pwInput.value.length > 0;
  const isPwConfirmValid = pwConfirmInput.value.length > 0;
  const isSelectsValid = Array.from(selects).every(select => select.value !== '');
  const isValid = isNameValid && isIdValid && isPwValid && isPwConfirmValid && isSelectsValid;

  submitBtn.disabled = isSubmitting || !isValid;
  submitBtn.style.opacity = submitBtn.disabled ? '0.5' : '1';
  return isValid;
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
}

function isValidName(value) {
  const len = value.trim().length;
  return len >= 2 && len <= 20;
}

function isValidUsername(value) {
  return /^[A-Za-z0-9]{4,20}$/.test(value);
}

function isValidPassword(value) {
  return value.length >= 8
  && /[A-Za-z]/.test(value)
  && /[0-9]/.test(value)
  && /[^A-Za-z0-9]/.test(value)
  && !/\s/.test(value);
}

// 입력창 + 드롭다운
fields.forEach(input => {
  input.addEventListener('input', (e) => {
    checkForm();
    toggleEyeIcon(e.target);
    errorMsg.style.display = 'none';
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isSubmitting || !checkForm()) return;
  if (!SERVER_URL.trim()) {
    showError('env.js에 서버 주소를 입력해주세요.');
    return;
  }
  if (!isValidName(nameInput.value)) {
    showError('이름은 2~20자로 입력해주세요.');
    return;
  }
  if (!isValidUsername(idInput.value)) {
    showError('아이디는 영문과 숫자를 포함해 4~20자여야 합니다.');
    return;
  }
  if (!isValidPassword(pwInput.value)) {
    showError('비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.');
    return;
  }
  if (pwInput.value !== pwConfirmInput.value) {
    showError('비밀번호가 일치하지 않습니다.');
    return;
  }

  const student = {
    name: nameInput.value.trim(),
    username: idInput.value.trim(),
    password: pwInput.value,
    grade: Number(gradeSelect.value),
    studentClass: Number(classSelect.value),
    number: Number(numberSelect.value),
  };

  isSubmitting = true;
  fields.forEach(field => { field.disabled = true; });
  submitBtn.textContent = '가입 중...';
  form.setAttribute('aria-busy', 'true');
  errorMsg.style.display = 'none';
  checkForm();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${SERVER_URL.trim().replace(/\/+$/, '')}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(student),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 400) {
        throw new Error('가입 정보를 확인해주세요.');
      }
      if (response.status === 409) {
        throw new Error('이미 등록된 정보입니다. 입력한 내용을 확인해주세요.');
      }
      if (response.status === 429) {
        throw new Error('가입 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
      if (response.status === 404) {
        throw new Error('회원가입 서버를 찾을 수 없습니다.');
      }
      throw new Error('요청을 처리하지 못했습니다. 잠시 후 다시 확인해주세요.');
    }

    const memberId = await response.json();
    if (!Number.isInteger(memberId) || memberId <= 0) {
      throw new Error('가입 결과를 확인하지 못했습니다. 로그인 화면에서 가입 여부를 확인해주세요.');
    }

    alert('회원가입이 완료되었습니다.');
    location.href = '../login/login.html';
  } catch (error) {
    if (error.name === 'AbortError' || error instanceof TypeError || error instanceof SyntaxError) {
      showError('가입 결과를 확인하지 못했습니다. 서버 연결 상태를 확인해주세요.');
    } else {
      showError(error.message);
    }
  } finally {
    clearTimeout(timeoutId);
    isSubmitting = false;
    fields.forEach(field => { field.disabled = false; });
    submitBtn.textContent = '가입하기';
    form.setAttribute('aria-busy', 'false');
    checkForm();
  }
});


// 비밀번호 보기/숨기기
document.querySelectorAll('.pw-toggle').forEach(btn => {
  const eyeIcon = btn.querySelector('.icon-eye');
  const eyeOffIcon = btn.querySelector('.icon-eye-off');

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(btn.dataset.target);
    const isPassword = target.type === 'password';
    target.type = isPassword ? 'text' : 'password';
    btn.setAttribute('aria-label', isPassword ? '비밀번호 숨기기' : '비밀번호 보기');
    eyeIcon.style.display = isPassword ? 'none' : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';
  });
});

window.addEventListener('pageshow', () => {
  checkForm();
  toggleEyeIcon(pwInput);
  toggleEyeIcon(pwConfirmInput);
});
checkForm();
toggleEyeIcon(pwInput);
toggleEyeIcon(pwConfirmInput);
