import { SERVER_URL } from '../../env.js';

const form = document.querySelector('form');
const idInput = document.querySelector('#user-id');
const pwInput = document.querySelector('#pw-input');
const submitBtn = document.querySelector('button[type="submit"]');
const errorMsg = document.querySelector('.error-msg');

let isSubmitting = false;

function checkForm() {
  const isIdValid = idInput.value.trim() !== '';
  const isPwValid = pwInput.value.length > 0;
  submitBtn.disabled = isSubmitting || !isIdValid || !isPwValid;
  submitBtn.style.opacity = submitBtn.disabled ? '0.5' : '1';
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.style.display = 'block';
}

[idInput, pwInput].forEach(input => {
  input.addEventListener('input', () => {
    checkForm();
    toggleEyeIcon(pwInput);
    errorMsg.style.display = 'none';
  });
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (isSubmitting) return;

  const username = idInput.value.trim();
  const password = pwInput.value;
  if (!username || !password) return;
  if (!SERVER_URL.trim()) {
    showError('env.js에 서버 주소를 입력해주세요.');
    return;
  }

  isSubmitting = true;
  idInput.disabled = true;
  pwInput.disabled = true;
  submitBtn.textContent = '로그인 중...';
  form.setAttribute('aria-busy', 'true');
  errorMsg.style.display = 'none';
  checkForm();

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(`${SERVER_URL.trim().replace(/\/+$/, '')}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
      signal: controller.signal,
    });

    if (!response.ok) {
      if (response.status === 400 || response.status === 401) {
        throw new Error('아이디 혹은 비밀번호가 올바르지 않습니다.');
      }
      if (response.status === 429) {
        throw new Error('로그인 시도가 너무 많습니다. 잠시 후 다시 시도해주세요.');
      }
      if (response.status === 404) {
        throw new Error('로그인 서버를 찾을 수 없습니다. 서버 주소를 확인해주세요.');
      }
      throw new Error('로그인 요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.');
    }

    const data = await response.json();
    if (typeof data?.accessToken !== 'string' || !data.accessToken.trim()) {
      throw new Error('로그인 응답에 토큰이 없습니다. 서버 응답을 확인해주세요.');
    }

    // 로그인 뿐만 아니라 다른 파일에서도 sessionStorage.getItem('accessToken')으로 사용해주세요
    try {
      sessionStorage.setItem('accessToken', data.accessToken);
    } catch {
      throw new Error('로그인 정보를 저장할 수 없습니다. 브라우저의 저장소 설정을 확인해주세요.');
    }
    location.href = '../../main/main.html';
  } catch (error) {
    if (error.name === 'AbortError') {
      showError('서버 응답이 늦어지고 있습니다. 잠시 후 다시 시도해주세요.');
    } else if (error instanceof TypeError) {
      showError('서버에 연결하지 못했습니다. 네트워크 상태나 서버 연결 설정을 확인해주세요.');
    } else if (error instanceof SyntaxError) {
      showError('로그인 서버의 응답 형식이 올바르지 않습니다.');
    } else {
      showError(error.message);
    }
  } finally {
    clearTimeout(timeoutId);
    isSubmitting = false;
    idInput.disabled = false;
    pwInput.disabled = false;
    submitBtn.textContent = '로그인';
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

// 비밀번호 보기 버튼 활성화
function toggleEyeIcon(input) {
  const toggleBtn = input.parentElement.querySelector('.pw-toggle');
  if (!toggleBtn) return;

  if (input.value.length > 0) {
    toggleBtn.style.display = 'flex';
  } else {
    toggleBtn.style.display = 'none';
  }
}

// 새로고침,뒤로가기 등으로 입력값이 복원됐을 때도 버튼 상태 유지
window.addEventListener('pageshow', () => {
  checkForm();
  toggleEyeIcon(pwInput);
});
checkForm();
toggleEyeIcon(pwInput);
