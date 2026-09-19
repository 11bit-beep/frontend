// 요소 선택
const form = document.querySelector('form');
const idInput = document.querySelector('#user-id');
const pwInput = document.querySelector('#pw-input');
const submitBtn = document.querySelector('button[type="submit"]');
const errorMsg = document.querySelector('.error-msg');

submitBtn.disabled = true;

// 입력 확인 및 로그인 버튼 활성화
function checkForm() {
  const isIdValid = idInput.value.trim() !== '';
  const isPwValid = pwInput.value.trim() !== '';

  if (isIdValid && isPwValid) {
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;
  } else {
    submitBtn.style.opacity = '0.5';
    submitBtn.disabled = true;
  }
}


// 입력값이 변경될 때마다 - 에러메시지 숨김
[idInput, pwInput].forEach(input => {
  input.addEventListener('input', () => {
    checkForm();
    if (errorMsg) errorMsg.style.display = 'none';
  });
});

// 비밀번호 입력창 이벤트 (폼 양식 확인 + 눈 버튼 토글 + 에러 메시지 초기화)
[pwInput].forEach(input => {
  input.addEventListener('input', (e) => {
    checkForm();
    toggleEyeIcon(e.target);
    if (errorMsg) errorMsg.style.display = 'none';
  });
});


// 제출 이벤트
form.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const id = idInput.value.trim();
  const pw = pwInput.value.trim();

  // (이벤트 작동하는지 확인하려고 넣은 임시) 아이디/비밀번호
  const isValid = (id === 'test' && pw === '1234');

  if (!isValid) {
    if (errorMsg) errorMsg.style.display = 'block';
  } else {
    if (errorMsg) errorMsg.style.display = 'none';
      location.href = '../main/main.html';
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
    eyeIcon.style.display = isPassword ? 'none' : 'block';
    eyeOffIcon.style.display = isPassword ? 'block' : 'none';
  });
});


// 입력 상태에 따라 눈알 버튼 토글하는 함수
function toggleEyeIcon(input) {
  const toggleBtn = input.parentElement.querySelector('.pw-toggle');
  if (!toggleBtn) return;

  if (input.value.length > 0) {
    toggleBtn.style.display = 'flex';
  } else {
    toggleBtn.style.display = 'none';
  }
}