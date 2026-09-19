# 삑

HTML, CSS, JavaScript로 만든 출결관리 서비스

## 실행

1. `env.example.js`를 복사해서 `env.js`를 만듭니다.
2. `SERVER_URL`에 팀에서 공유한 서버 주소를 넣습니다.
3. VS Code에서 `auth/login/login.html`을 Live Server로 엽니다.

주소는 `http://127.0.0.1:5500`을 사용합니다. 백엔드에서 허용한 개발 주소입니다.
파일을 더블클릭해서 열면 JS 모듈을 사용할 수 없습니다.

Live Server 대신 터미널에서도 실행할 수 있습니다.

```sh
python3 -m http.server 5500 --bind 127.0.0.1
```

- [로그인](http://127.0.0.1:5500/auth/login/login.html)
- [회원가입](http://127.0.0.1:5500/auth/signup/signup.html)

`env.js`는 각자 설정하는 파일이라 Git에 올리지 않습니다.

## 로그인·회원가입

- 로그인: `POST /api/auth/login` — username, password
- 회원가입: `POST /api/auth/signup` — name, username, password, grade, studentClass, number
- 로그인하면 `sessionStorage`의 `accessToken`에 토큰을 저장합니다.
- 회원가입하면 완료 안내 후 로그인 화면으로 이동합니다.
- 로그아웃하면 토큰을 삭제합니다.

서버 주소는 아래처럼 가져옵니다. HTML의 script에는 `type="module"`이 필요합니다.

```js
// auth/login/login.js 기준
import { SERVER_URL } from '../../env.js';
```

출석조회에서는 `authFetch`를 쓰면 로그인 토큰이 같이 전송됩니다.
401 응답이면 저장된 토큰을 지우고 오류를 알려주므로, 화면에서 로그인 안내를 표시하면 됩니다.

```js
// management 폴더의 JS 기준
import { authFetch } from '../auth/request.js';

const response = await authFetch('/api/attendance/classes/1/1');
if (!response.ok) throw new Error('출석 정보를 불러오지 못했습니다.');
const data = await response.json();
```

작업 이슈: [#17 로그인 api 연동](https://github.com/11bit-beep/frontend/issues/17)
