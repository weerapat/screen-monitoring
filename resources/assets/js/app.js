window.$ = window.jQuery = require('jquery');

import * as Guacamole from 'guacamole-common-js';

let agentMachines = [
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 3',
        'guacid': 9,
        'guacid_thumb': 7
    }
];

// Get display div from document
let display = document.getElementById("display");

let guac = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);

let guac2 = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);

let guacFull = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);

// Add client to display div
display.appendChild(guac.getDisplay().getElement());

document.getElementById('display-2').appendChild(guac2.getDisplay().getElement());
document.getElementById('display-fullscreen').appendChild(guacFull.getDisplay().getElement());

// Mouse
let mouse = new Guacamole.Mouse(guacFull.getDisplay().getElement());

mouse.onmousedown =
    mouse.onmouseup   =
        mouse.onmousemove = function(mouseState) {
            guacFull.sendMouseState(mouseState);
        };

// Keyboard
let keyboard = new Guacamole.Keyboard(document);

keyboard.onkeydown = function (keysym) {
    guacFull.sendKeyEvent(1, keysym);
};

keyboard.onkeyup = function (keysym) {
    guacFull.sendKeyEvent(0, keysym);
};
// End mouse

// Error handler
guac.onerror = function(error) {
    alert(error);
};

let authToken = null;

$.post('http://guacamole.rabbit/guacamole/api/tokens',
    {
        username : 'guacadmin',
        password: 'guacadmin'
    }, (data) => {
        authToken = data.authToken;
        guac.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=7&token=${authToken}`);
        guac2.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=5&token=${authToken}`);
        guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=8&token=${authToken}`);
    }
);

$('.monitor-thumbnails').on('click', function () {
    let guactId = $(this).data('id');
    switchView(guactId);
});

function switchView(guacId) {
    guacFull.disconnect();
    guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=${guacId}&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=${authToken}`);
}

// Disconnect on close
window.onunload = function() {
    guacFull.disconnect();
};