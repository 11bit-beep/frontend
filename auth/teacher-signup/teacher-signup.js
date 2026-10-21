const form = document.querySelector('form');
const nameInput = document.querySelector('#user-name');
const idInput = document.querySelector('#user-id');
const pwInput = document.querySelector('#pw-input');
const pwConfirmInput = document.querySelector('#pw-confirm-input');
const submitBtn = document.querySelector('button[type="submit"]');
const errorMsg = document.querySelector('.error-msg');
const fields = [nameInput, idInput, pwInput, pwConfirmInput];

function toggleEyeIcon(input) {
  const toggleBtn = input.parentElement.querySelector('.pw-toggle');
  if (!toggleBtn) return;
  toggleBtn.style.display = input.value.length > 0 ? 'flex' : 'none';
}

function checkForm() {
  const isValid = nameInput.value.trim() !== ''
    && idInput.value.trim() !== ''
    && pwInput.value.length > 0
    && pwConfirmInput.value.length > 0;

  submitBtn.disabled = !isValid;
  submitBtn.style.opacity = isValid ? '1' : '0.5';
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

fields.forEach(input => {
  input.addEventListener('input', () => {
    checkForm();
    toggleEyeIcon(input);
    errorMsg.style.display = 'none';
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!checkForm()) return;

  if (!isValidName(nameInput.value)) {
    showError('이름은 2~20자로 입력해주세요.');
    return;
  }
  if (!isValidUsername(idInput.value.trim())) {
    showError('아이디는 영문 또는 숫자로 4~20자 입력해주세요.');
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

  showError('선생님 회원가입은 준비 중입니다.');
});

document.querySelectorAll('.pw-toggle').forEach(btn => {
  const eyeIcon = btn.querySelector('.icon-eye');
  const eyeOffIcon = btn.querySelector('.icon-eye-off');

  btn.addEventListener('click', () => {
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
