import { SERVER_URL } from '../env.js';

// 출석조회처럼 로그인이 필요한 요청에 사용
export async function authFetch(path, options = {}) {
  const token = sessionStorage.getItem('accessToken');
  if (!token) throw new Error('로그인이 필요합니다.');
  if (!SERVER_URL.trim()) throw new Error('env.js에 서버 주소를 입력해주세요.');

  const headers = new Headers(options.headers);
  headers.set('Authorization', `Bearer ${token}`);

  const response = await fetch(`${SERVER_URL.trim().replace(/\/+$/, '')}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    sessionStorage.removeItem('accessToken');
    throw new Error('로그인이 만료되었습니다. 다시 로그인해주세요.');
  }
  return response;
}
