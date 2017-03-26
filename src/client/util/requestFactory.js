const buildQueryString = query => {
  let queryString = '';
  const keys = Object.keys(query);
  keys.forEach((key, index) => {
    const separator = (index === 0) ? '?' : '&';
    queryString += `${separator}${key}=${query[key]}`;
  });
  return queryString;
};

export const buildGet = (url, token, query) => {
  const headers = new Headers();
  let endpoint = url;
  if (query) {
    endpoint += buildQueryString(query);
  }

  if (token) {
    headers.append('authorization', `Bearer ${token}`);
  }
  headers.append('Content-Type', 'application/json');
  const request = new Request(
    endpoint,
    { method: 'GET', headers }
  );
  return request;
};

export const buildPost = (url, body, token) => {
  const headers = new Headers();
  if (token) {
    headers.append('authorization', `Bearer ${token}`);
  }
  headers.append('Content-Type', 'application/json');
  const request = new Request(
    url,
    { method: 'POST', body, headers }
  );
  return request;
};
