import * as Guacamole from 'guacamole-common-js';

console.log(Guacamole);

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
// Get token


// Get display div from document
var display = document.getElementById("display");

// Instantiate client, using an HTTP tunnel for communications.
console.log(Guacamole);

var guac = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);

var guac2 = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);

var guacFull = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);

// Add client to display div
display.appendChild(guac.getDisplay().getElement());

document.getElementById('display-2').appendChild(guac2.getDisplay().getElement());
document.getElementById('display-fullscreen').appendChild(guacFull.getDisplay().getElement());

// Mouse
var mouse = new Guacamole.Mouse(guacFull.getDisplay().getElement());

mouse.onmousedown =
    mouse.onmouseup   =
        mouse.onmousemove = function(mouseState) {
            guacFull.sendMouseState(mouseState);
        };

// Keyboard
var keyboard = new Guacamole.Keyboard(document);

keyboard.onkeydown = function (keysym) {
    guacFull.sendKeyEvent(1, keysym);
};

keyboard.onkeyup = function (keysym) {
    guacFull.sendKeyEvent(0, keysym);
};
// End mouse

// Add keyboard to body
//var keyboard = new Guacamole.OnScreenKeyboard('layout.xml');
//$('#keyboard').html(keyboard.getElement());
//
//// Set size of keyboard to 100 pixels
//keyboard.resize(100);
//
//
//// Add layer
//var layer = new Guacamole.OnScreenKeyboard('layout.xml');
//$('#keyboard').html(keyboard.getElement());

// Error handler
guac.onerror = function(error) {
    alert(error);
};

// Connect
// guac.connect('GUAC_ID=9&token=' + apiToken);

var authToken = null;

$.post( "http://guacamole.rabbit/guacamole/api/tokens", { username : 'guacadmin', password: 'guacadmin'}, function( data ) {
    $( "#token" ).html( data.authToken );

    //var apiToken = data.authToken;

    // Mock params
    /**
     *
     * GUAC_DATA_SOURCE:mysql
     GUAC_ID:9
     GUAC_TYPE:c
     GUAC_WIDTH:2490
     GUAC_HEIGHT:2686
     GUAC_DPI:192
     GUAC_AUDIO:audio/L8
     GUAC_AUDIO:audio/L16
     GUAC_IMAGE:image/jpeg
     GUAC_IMAGE:image/png
     GUAC_IMAGE:image/webp
     * ID 8 = PC 3
     * ID 9 = PC 2
     **/

    authToken = data.authToken;

    guac.connect('GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=7&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=' + authToken);
    guac2.connect('GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=5&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=' + authToken);
    guacFull.connect('GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=8&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=' + authToken);
});


$('.monitor-thumbnails').on('click', function () {

    let guactId = $(this).data('id');
    switchView(guactId);
});

function switchView(guacId) {
    guacFull.disconnect();
//
//    var guacFull = new Guacamole.Client(
//        new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
//    );

    guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=${guacId}&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=${authToken}`);
}

// Disconnect on close
window.onunload = function() {
    guacFull.disconnect();
}
