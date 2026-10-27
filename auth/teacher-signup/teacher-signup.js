import { SERVER_URL } from '../../env.js';

const form = document.querySelector('form');
const nameInput = document.querySelector('#user-name');
const codeInput = document.querySelector('#user-code');
const idInput = document.querySelector('#user-id');
const pwInput = document.querySelector('#pw-input');
const pwConfirmInput = document.querySelector('#pw-confirm-input');
const submitBtn = document.querySelector('button[type="submit"]');
const errorMsg = document.querySelector('.error-msg');
const fields = [nameInput, codeInput, idInput, pwInput, pwConfirmInput];
let isSubmitting = false;

function checkForm() {
  const isValid = fields.every(input => input.value.trim() !== '');
  submitBtn.disabled = isSubmitting || !isValid;
  submitBtn.style.opacity = submitBtn.disabled ? '0.5' : '1';
  return isValid;
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
}

function isValidName(value) {
  const length = value.trim().length;
  return length >= 2 && length <= 20;
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

function toggleEyeIcon(input) {
  const toggleBtn = input.parentElement.querySelector('.pw-toggle');
  if (toggleBtn) toggleBtn.style.display = input.value ? 'flex' : 'none';
}

fields.forEach(input => {
  input.addEventListener('input', () => {
    checkForm();
    toggleEyeIcon(input);
    errorMsg.style.display = 'none';
  });
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (isSubmitting || !checkForm()) return;

  const name = nameInput.value.trim();
  const teacherCode = codeInput.value.trim();
  const username = idInput.value.trim();
  const password = pwInput.value;

  if (!SERVER_URL.trim()) {
    showError('서버 주소를 확인해주세요.');
    return;
  }
  if (!isValidName(name)) {
    showError('이름은 2~20자로 입력해주세요.');
    return;
  }
  if (!isValidUsername(username)) {
    showError('아이디는 영문 또는 숫자로 4~20자 입력해주세요.');
    return;
  }
  if (!isValidPassword(password)) {
    showError('비밀번호는 영문, 숫자, 특수문자를 포함해 8자 이상이어야 합니다.');
    return;
  }
  if (password !== pwConfirmInput.value) {
    showError('비밀번호가 일치하지 않습니다.');
    return;
  }

  isSubmitting = true;
  fields.forEach(input => { input.disabled = true; });
  submitBtn.textContent = '가입 중...';
  form.setAttribute('aria-busy', 'true');
  errorMsg.style.display = 'none';
  checkForm();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${SERVER_URL.trim().replace(/\/+$/, '')}/api/auth/teacher/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, teacherCode, username, password }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      if (response.status === 400 && errorData?.message === '교사 코드가 올바르지 않습니다.') {
        throw new Error('교사 코드가 일치하지 않습니다.');
      }
      if ((response.status === 400 || response.status === 409) && errorData?.message === '이미 존재하는 아이디입니다.') {
        throw new Error('이미 사용 중인 아이디입니다.');
      }
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
    fields.forEach(input => { input.disabled = false; });
    submitBtn.textContent = '가입하기';
    form.setAttribute('aria-busy', 'false');
    checkForm();
  }
});

document.querySelectorAll('.pw-toggle').forEach(button => {
  const eyeIcon = button.querySelector('.icon-eye');
  const eyeOffIcon = button.querySelector('.icon-eye-off');

  button.addEventListener('click', () => {
    const input = document.getElementById(button.dataset.target);
    const showPassword = input.type === 'password';
    input.type = showPassword ? 'text' : 'password';
    button.setAttribute('aria-label', showPassword ? '비밀번호 숨기기' : '비밀번호 보기');
    eyeIcon.style.display = showPassword ? 'none' : 'block';
    eyeOffIcon.style.display = showPassword ? 'block' : 'none';
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
