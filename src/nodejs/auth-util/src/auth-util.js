/**
 * Lambda Layer to abstract interacting with Cognito IDP
 * @module Version
 */
const httpHelper = require('./http-helper.js');
const jwt = require('jsonwebtoken');

const providerUrl = process.env.AUTH_PROVIDER_URL;
const loginPath = process.env.AUTH_LOGIN_PATH;
const authorizePath = process.env.AUTH_AUTHORIZE_PATH;
const tokenPath = process.env.AUTH_TOKEN_PATH;
const userPath = process.env.AUTH_USER_PATH;

const clientId = process.env.AUTH_CLIENT_ID;
const clientSecret = process.env.AUTH_CLIENT_SECRET;
const callbackUrl = process.env.AUTH_CALLBACK_URL;
const stateUrl = process.env.AUTH_STATE_URL;


async function redirectWithToken({ code, refresh, state }) {
    const tokenRequest = {
      method: 'post',
      endpoint: new URL(tokenPath, providerUrl),
      auth: { type: 'basic', username: clientId, password: clientSecret },
      payload: {
        type: 'form',
        data: {
          redirect_uri: callbackUrl,
          ...(code ? { code, grant_type: 'authorization_code' } : {}),
          ...(refresh ? { refresh_token: refresh, grant_type: 'refresh_token' } : {})
        }
      }
    }
    const { id_token: idToken,
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_in: expires,
            token_type: type } = await httpHelper.send(tokenRequest);
    const user = jwt.decode(idToken);
    user.id = user.sub;
    user.username = user["cognito:username"];
    const redirect = new URL(state || stateUrl);
    redirect.searchParams.set('token', accessToken);
    return { redirect: redirect.href, user };
  }

async function redirectGetCode({ code, refresh, state }) {
  const redirect = new URL(loginPath, providerUrl);
  redirect.search = new URLSearchParams({
    client_id: clientId,
    redirect_uri: callbackUrl,
    scope: 'openid',
    response_type: 'code',
    ...(state ? { state } : {})
  });
  return { redirect: redirect.href };
}

module.exports.redirectWithToken = redirectWithToken;
module.exports.redirectGetCode = redirectGetCode;


// const test = {
//     "id_token": "eyJraWQiOiJvVWVHbUhqMGhLTmZldUVyUGJ0VXRWZHdlME56RUZkRzVYcHh2citqR1ZVPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoidmFaX2IweHpNWDRRTFRHajRJY0lTUSIsInN1YiI6ImYyMjdiNGNjLThiNzktNDJlYy1hODIzLTRiOGU1ZTJlNzJlZSIsImF1ZCI6IjYzOWYzcG1sc2wyY2s5cHBlbjZjNTVjYm1hIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNjA4MDY5ODIyLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtd2VzdC0yLmFtYXpvbmF3cy5jb21cL3VzLXdlc3QtMl9QcFVsaDlCM2wiLCJuYW1lIjoiQnJpYW4gRWxsaW5nc29uIiwiY29nbml0bzp1c2VybmFtZSI6ImJyaWFuIiwiZXhwIjoxNjA4MDczNDIyLCJpYXQiOjE2MDgwNjk4MjIsImVtYWlsIjoiYmRlMDAwOUB1YWguZWR1In0.R0MurM3lZ1Qz7HJSpPOPYvd9KhsjvP5S-Fq4ZCl2ZkPXGOm92iS10hcFnJaRomi683WgM7UI2UR1fr5lVu1ihI2GKs3YC1vt0jogQabHMIyZEr7kSpgg94qAd5je4XYsuJPCrZYz2h8qG1UI_tJC4ekHT81g0E9dcH_zXZ6DtT9Gn0IGKga1vrlHpQWVqZ7axBWFwd9hwvaNnm8fNsnPgb4v3UdVzP3PMRFNoF0vSZSVlnUyfnFv-KuojaIb3oSGMtcTqS0xfjsrjnCVFMxVkbLU3KLkO5pMiGpBgFR1AUHrzrKgLtV4XL63J4GlqtZI0ztyvB4hTmRlunRPXvQU8Q",
//     "access_token": "eyJraWQiOiJDQ1FmZjB6d0RZMEJNNjUzZXFwWGFZRitNS0tjVjZ1SFNwa1JmZDlPSUYwPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmMjI3YjRjYy04Yjc5LTQyZWMtYTgyMy00YjhlNWUyZTcyZWUiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6Im9wZW5pZCIsImF1dGhfdGltZSI6MTYwODA2OTgyMiwiaXNzIjoiaHR0cHM6XC9cL2NvZ25pdG8taWRwLnVzLXdlc3QtMi5hbWF6b25hd3MuY29tXC91cy13ZXN0LTJfUHBVbGg5QjNsIiwiZXhwIjoxNjA4MDczNDIyLCJpYXQiOjE2MDgwNjk4MjIsInZlcnNpb24iOjIsImp0aSI6IjVlNmI4MzkyLWY2ODctNDI0Zi1iZDNiLWY0NWU2N2Q4NGZmYiIsImNsaWVudF9pZCI6IjYzOWYzcG1sc2wyY2s5cHBlbjZjNTVjYm1hIiwidXNlcm5hbWUiOiJicmlhbiJ9.LRunnjspAzRAcMT3ew4DFanMcs74JRJyYQ1tgH5s9fD3hFtrpdOUVQclPdVv_S55GpI8rB9DxpEnaB4zTDyM8AYmjnE7h2Y6z67i1G0z4MTJ_tHfU4ziPFv-vjBWwrRG066x_zjIrteHZhoYZsZYuGcmqkLF93voUPq9-D-D2aBIITrKj6qayPdj7982dVbYvUVZkRP65U05l08bHy0qYS9jhW-6I2eyWU391Rd92X5Vlb7Zxks6NyBeCEi98Wlkkjf8LGRQMZh_t4P5RILXf9vxDGW81ycfmImfIk3iMCsvrdUpIoS41KKhaMC-RUHdiBljVP4-cYmzF7RErpy6kA",
//     "refresh_token": "eyJjdHkiOiJKV1QiLCJlbmMiOiJBMjU2R0NNIiwiYWxnIjoiUlNBLU9BRVAifQ.bgw2FX62LHa9PLQFhKNHpOXPiDPDD4rddQVmVeiuftWhwSVVNDER2aPuZYE6sDq44k32WfDJYSF0unx55yRPwgmLXpvCiFB85pkCBDuSXil6bLzkbTG0xQ21MaFxXa_VO_Q7Nt1ENu4hjw4d2xFNM9PoSeC88OHDSm6hy9SJS60Y_LDdgnXF89pJy-9jcgwmPp_JIKqcFrDupdxaZKRXzHifXgHVrUAVib2oPAVxk_Oaya84ASoCbPRkSNznvbRNirlGwetbFG2XPXXEC7A-UbMqvog2ofaLGJSBPlKNcbxFrOMV4VabPUg90aAQ8Eit1TVC0-LtZRYICUvZIf_lJQ.Tmz_4njPJ_aQsLJT.f4eJI-38o-ALlic2GwRy_-vKmDjL8C9QJ4Qop1rMf1p3bbeDvk-yzv8osBRNV6wto1eg70H58RQltjH8YYBvHG-LtsXVXAaqlft4JwWVIXAhLXNcUi1JzVXmMQadKIUkSj59KP9NXU26lxU3uCyjLe4dEL130uKWhJkOQUCTRxBRCm-LWJE1W58FgUrlyRdJkRyGPswb-cBj4xcFD3vD6a21ydl_CBpRhnXfdBS8sMKBdjXum526Azh14VKkHjSRQ6VmWpSAD-EMHq4-LRbvPCjWBlm18J3BJPKTTHtIo7sn_t26zkeNy1sY9w0QR2_dj6Bi7k9LIbjgZ8EsDTCgwX9p8fLg-L-RU7HIzsz1dPT9vRz3XDCjkmeVNiBhEcSqdAKyKK78UJoKm-NdW9fQDbCLi8Vw0REMgsbcgFGbjFtRT13CFbWbVkg5xCh9CH-1B9Ip7YerTpePCn3SbBTEl-ivWdMLiVS6RYsgv4xJruZvg5aNRLHy0KCAD0CVC36MOkilZToB76T2K4JrW0PhBiKibBKl-vRihrO3JqVd_w58J4xfWPBO9KWvWo0Y5CtyW00qxZxoGPZWCJOunTzvYsYiJo8jtLVhVjdcscxhr5yslUKAiw93meZvHOVXayS6iFHu3GQ9uEvHPDZbvD1uGo433LZgK-bwD7XJxUUTqQ18amkqL4ChPpx3E7x_5x4J7bWe1cHxkq2GuF6Lqwe8kC29-JlkOBrSA_asnF_GsgXpR0THro-R5EBuYXPNv3znT1vVdlAHfSuJYTg6CJRcLUvCC8ZNuSIa6-lAhqGcABEjGBO5Wved_5ke3V3ZQMA9t_W8t2aFc4onoXK0yiHEq2UyI5LhWuDzqhtVfBBMPITqpARfJwtn1ggrSGH_oCADgsTlPD36dZmA2iqduSSEKBX1CNxk425vJ3JSFAJ0CM-kO3SUUQWL8Al8zDPebgEJo9hkNrn3BaeytfFYd1zG9EeZcb01ajqFggFD3yOJE1RSJ_KhvCBT0D42TUDM73Dbuxsp_DCwbclN3G1eQge9YZAjgzQFWuJVygkFU-6q2SY3Goobsl0ldMKV2UEjFrx9YLXT1Azo5yd6xB0QsIYHY_oSqw1udfm_0yWSWDiA5bgNw6-Nso7J6dhb0fDENizWTmST4S2uLhCr9eTap2-72482.a1Xqa5FRKr5OZvaDZtBMfQ",
//     "expires_in": 3600,
//     "token_type": "Bearer"
// }
