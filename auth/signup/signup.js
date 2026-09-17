// 요소 선택
const form = document.querySelector('form');
const nameInput = document.querySelector('#user-name');
const idInput = document.querySelector('#user-id');
const pwInput = document.querySelector('#pw-input');
const pwConfirmInput = document.querySelector('#pw-confirm-input');
const selects = document.querySelectorAll('select');
const submitBtn = document.querySelector('button[type="submit"]');
const errorMsg = document.querySelector('.error-msg');


// 입력 상태에 따라 비번 보기(눈) 버튼 활성화
function toggleEyeIcon(input) {
  const toggleBtn = input.parentElement.querySelector('.pw-toggle');
  if (!toggleBtn) return;

  if (input.value.length > 0) {
    toggleBtn.style.display = 'flex';
  } else {
    toggleBtn.style.display = 'none';
  }
}


// 입력 확인 및 회원가입 버튼 활성화
function checkForm() {
  const isNameValid = nameInput.value.trim() !== '';
  const isIdValid = idInput.value.trim() !== '';
  const isPwValid = pwInput.value.trim() !== '';
  const isPwConfirmValid = pwConfirmInput.value.trim() !== '';
  const isSelectsValid = Array.from(selects).every(select => select.value !== '');

  if (isNameValid && isIdValid && isPwValid && isPwConfirmValid && isSelectsValid) {
    submitBtn.style.opacity = '1';
    submitBtn.disabled = false;
  } else {
    submitBtn.style.opacity = '0.5';
    submitBtn.disabled = true;
  }
}

submitBtn.disabled = true;


// 일반 입력창, 드롭다운 이벤트
[nameInput, idInput].forEach(input => {
  input.addEventListener('input', checkForm);
});

selects.forEach(select => {
  select.addEventListener('change', checkForm);
});


// 비밀번호 입력창 이벤트 (폼 양식 확인 + 눈 버튼 토글 + 에러 메시지 초기화)
[pwInput, pwConfirmInput].forEach(input => {
  input.addEventListener('input', (e) => {
    checkForm();
    toggleEyeIcon(e.target);
    if (errorMsg) errorMsg.style.display = 'none';
  });
});


// 비밀번호 일치하는지 확인/ 폼 제출
function checkPw(e) {
  if (pwInput.value !== pwConfirmInput.value) {
    e.preventDefault();
    errorMsg.style.display = 'block';
  } else {
    errorMsg.style.display = 'none';
    setTimeout(() => {
      alert('회원가입이 완료되었습니다!');
      location.href = "../login/login.html";
    }, 1);
  }
}
form.addEventListener('submit', checkPw);


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
