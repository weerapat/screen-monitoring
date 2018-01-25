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
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    },
    {
        'name': 'PC 2',
        'guacid': 8,
        'guacid_thumb': 5
    }
];

// Fulscreen set
let guacFull = new Guacamole.Client(
    new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
);


document.getElementById('display-monitor').appendChild(guacFull.getDisplay().getElement());

// Mouse
let mouse = new Guacamole.Mouse(guacFull.getDisplay().getElement());

mouse.onmousedown =
    mouse.onmouseup   =
        mouse.onmousemove = function(mouseState) {
            guacFull.sendMouseState(mouseState);
        };

// Keyboard
let keyboard = new Guacamole.Keyboard(document);

keyboard.onkeydown = function(keysym) {
    guacFull.sendKeyEvent(1, keysym);
};

keyboard.onkeyup = function(keysym) {
    guacFull.sendKeyEvent(0, keysym);
};

// End Fullscreenset

// End mouse
let authToken = null;

$.post('http://guacamole.rabbit/guacamole/api/tokens',
    {
        username : 'guacadmin',
        password: 'guacadmin'
    }, (data) => {
        authToken = data.authToken;

        let guac = [];

        $.each(agentMachines, function(i, agent) {
            guac[i] = new Guacamole.Client(
                new Guacamole.WebSocketTunnel('ws://guacamole.rabbit/guacamole/websocket-tunnel')
            );

            guac[i].connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=${agent.guacid_thumb}&token=${authToken}`);

            // Add client to display div
            $('.thumbnails').append(guac[i].getDisplay().getElement());

            // Error handler
            guac[i].onerror = function(error) {
                console.log(error);
            };
        });


        // temporary connection
        guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=8&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=${authToken}`);
    }
);


$('.monitor-thumbnails').on('click', function () {
    let guactId = $(this).data('id');
    switchView(guactId);
});

function switchView(guacId) {
    guacFull.disconnect();
    guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=${guacId}&GUAC_WIDTH=250&GUAC_HEIGHT=350&GUAC_DPI=192&GUAC_AUDIO=audio/L8&token=${authToken}`);

    //$('#display-monitor').fadeIn();
}

/**
 *    STATE_IDLE          = 0;
 *    STATE_CONNECTING    = 1;
 *    STATE_WAITING       = 2;
 *    STATE_CONNECTED     = 3;
 *    STATE_DISCONNECTING = 4;
 *    STATE_DISCONNECTED  = 5;
 * @param stateNumber
 */
guacFull.onstatechange = function (stateNumber) {
    console.log(stateNumber);
};

// Disconnect on close
window.onunload = function() {
    guacFull.disconnect();
};