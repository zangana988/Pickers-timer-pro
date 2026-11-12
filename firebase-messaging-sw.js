importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyCzS3Szv_JcVMYGQFlz3VmESNLwW1xiL0E",authDomain:"pickers-timer.firebaseapp.com",projectId:"pickers-timer",messagingSenderId:"928812160632",appId:"1:928812160632:web:eed8ef63a89f7f9f2e3f8d"});
var messaging=firebase.messaging();
messaging.onBackgroundMessage(function(p){
  var d=(p&&p.data)||{};
  try{if(self.navigator&&navigator.setAppBadge&&+d.count>0)navigator.setAppBadge(+d.count)}catch(e){}
  var k=d.kind,o={body:d.body||"",tag:d.tag||"alpha-alert",data:{url:d.url||"./"}};
  if(k){o.renotify=true;o.requireInteraction=true;o.vibrate=k==="warn"?[500,150,500,150,500,150,500]:[300,100,300,100,300]}
  return self.registration.showNotification(d.title||"ALPHA WMS",o);
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  var url=(e.notification.data&&e.notification.data.url)||"./";
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){if("focus" in list[i])return list[i].focus()}
    return clients.openWindow(url);
  }));
});
