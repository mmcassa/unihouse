export const environment = {
    production: false,
    version: '0.0.5',//require('../../package.json').version,
    apiUrl: window.location.href.substring(0,window.location.href.indexOf(':',window.location.href.indexOf('//'))).substring(window.location.href.indexOf(':')+1),
    redirectUri: window.location.href.substring(0,window.location.href.indexOf('/',window.location.href.indexOf(':',window.location.href.indexOf('//')))),
    authConfig: {
      authProvider: 'msal',
      apiUrl: '/',
      redirectUri: window.location.href.substring(0,window.location.href.indexOf('/',window.location.href.indexOf(':',window.location.href.indexOf('//')))),
      authConfig: {
        auth: {
          clientId: "317b7a01-b26f-4901-8981-00ac2db459c1",
          authority: "https://login.microsoftonline.com/" + "4c41af04-b57a-41b6-a455-0a0c894dad69",
          redirectUri: "https://rezscope.uga.edu",
          postLogoutRedirectUri: "https://rezscope.uga.edu/logout",
          navigateToLoginRequestUrl: true
          },
          cache: {
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
        interceptor: {
            interactionType: "redirect",
            protectedResourceMap: new Map([
              [
                "https://rezscope.uga.edu/0",
                ["api://317b7a01-b26f-4901-8981-00ac2db459c1/Read.All",]
              ],
            ])
        }
      }

    },    
    title: 'REZian Telescope'
  };