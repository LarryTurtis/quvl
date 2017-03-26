import decode from 'jwt-decode';
import { createHash } from 'crypto';

export const hashUserId = id => createHash('sha1').update(id).digest('hex');

export const getTokenExpirationDate = jwt => {
  const token = decode(jwt);
  if (!token.exp) return null;

  const date = new Date(0);
  date.setUTCSeconds(token.exp);
  return date;
};

export const isTokenExpired = jwt => {
  const now = new Date().valueOf();
  const date = getTokenExpirationDate(jwt);
  if (date === null) return false;
  return date.valueOf() < now.valueOf();
};

export const getUserFromProfile = (token, profile) => ({
  token,
  id: hashUserId(profile.user_id),
  name: profile.name,
  nickname: profile.nickname,
  firstName: profile.given_name,
  lastName: profile.family_name,
  email: profile.email,
  gender: profile.gender,
  locale: profile.locale,
  picture: profile.picture,
  role: profile.app_metadata.roles[0]
});
