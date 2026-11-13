// ALPHA Z WMS: shows a phone notification for every alert, also when the app is closed.
// iPhone / iPad Home Screen apps require a notification for EVERY push, so this file shows it itself
// (Firebase's own display handler is not used, so each alert appears once).
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js","https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");
firebase.initializeApp({apiKey:"AIzaSyCzS3Szv_JcVMYGQFlz3VmESNLwW1xiL0E",authDomain:"pickers-timer.firebaseapp.com",projectId:"pickers-timer",messagingSenderId:"928812160632",appId:"1:928812160632:web:eed8ef63a89f7f9f2e3f8d"});
var messaging=firebase.messaging();
function show(d){
  d=d||{};
  try{if(self.navigator&&navigator.setAppBadge&&+d.count>0)navigator.setAppBadge(+d.count)}catch(e){}
  var k=d.kind,o={body:d.body||"",tag:d.tag||"alpha-alert",data:{url:d.url||"./"}};
  if(k){o.renotify=true;o.requireInteraction=true;o.vibrate=k==="warn"?[500,150,500,150,500,150,500]:[300,100,300,100,300]}
  return self.registration.showNotification(d.title||"ALPHA Z WMS",o);
}
// (no onBackgroundMessage here: the direct push handler below shows each alert exactly once)
// direct handler: guarantees a visible notification on iPhone / iPad
self.addEventListener("push",function(e){
  var j=null;try{j=e.data&&e.data.json()}catch(x){}
  var d=(j&&(j.data||(j.notification&&{title:j.notification.title,body:j.notification.body})))||null;
  if(!d||(!d.title&&!d.body))return;
  e.waitUntil(show(d));
});
self.addEventListener("notificationclick",function(e){
  e.notification.close();
  var url=(e.notification.data&&e.notification.data.url)||"./";
  var go="",id="";try{var u=new URL(url);go=u.searchParams.get("go")||"";id=u.searchParams.get("id")||""}catch(x){}
  e.waitUntil(clients.matchAll({type:"window",includeUncontrolled:true}).then(function(list){
    for(var i=0;i<list.length;i++){
      if("focus" in list[i]){
        var c=list[i];
        return c.focus().then(function(f){try{(f||c).postMessage({alphaGo:go,id:id})}catch(x){}return f});
      }
    }
    return clients.openWindow(url);
  }));
});
