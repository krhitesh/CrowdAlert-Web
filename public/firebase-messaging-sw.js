/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/4.12.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.12.1/firebase-messaging.js');

firebase.initializeApp({
    'messagingSenderId': '200720994045'
});

// const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler(function(payload) {
    // Customize notification here
    var notificationTitle = payload.notification.title;
    var notificationOptions = {
      body: payload.notification.body,
      icon: '/static/media/logo.6e50c6f0.png',
      badge: '/static/media/logo.6e50c6f0.png',
    };
    window.localStorage.setItem('swfroo', payload);
    return self.registration.showNotification(notificationTitle,
      notificationOptions);
});