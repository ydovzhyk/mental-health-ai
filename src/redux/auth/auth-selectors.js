export const getLogin = ({ auth }) => auth.isLogin;
export const getIsRefreshing = ({ auth }) => auth.isRefreshing;
export const getSid = ({ auth }) => auth.sid;
export const getAccessToken = ({ auth }) => auth.accessToken;
export const getRefreshToken = ({ auth }) => auth.refreshToken;
export const getUser = ({ auth }) => auth.user;
export const getTypeOfRegistration = ({ auth }) => auth.typeOfRegistration;
export const getLoadingAuth = ({ auth }) => auth.loading;
export const getAuthError = ({ auth }) => auth.error;
export const getAuthMessage = ({ auth }) => auth.message;
export const getAccessCode = ({ auth }) => auth.user.accessCode;
export const getMessageIncognito = ({ auth }) => auth.messageIncognito;

