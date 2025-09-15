export const environment = {
    production: true,
    apiUrl: '/',
    version: '0.0.5',//require('../../package.json').version,
    redirectUri: window.location.href.substring(0,window.location.href.indexOf('/',window.location.href.indexOf('//')+2)),
    title: 'REZian Telescope',
    authConfig: {
      "auth": {
        "clientId": "7a91aa50-9695-4eff-9363-01ebcc18fd64",
        "authority": "https://login.microsoftonline.com/" + "4c41af04-b57a-41b6-a455-0a0c894dad69",
        "redirectUri": "https://rezscope.uga.edu",
        "postLogoutRedirectUri": "https://rezscope.uga.edu/logout",
        "navigateToLoginRequestUrl": true
        },
        "cache": {
            "cacheLocation": "localStorage",
            "storeAuthStateInCookie": false
      },
      guard: {
          interactionType: "redirect",
          authRequest: {
          scopes: ["user.read"]
          },
          loginFailedRoute: "/login-failed"
      },
      "interceptor": {
          "interactionType": "redirect",
          "protectedResourceMap": new Map([
            [
              "https://rezscope.uga.edu/0",
              ["api://7a91aa50-9695-4eff-9363-01ebcc18fd64/Read.All",]
            ],
          ])
      }
    }
    
  };