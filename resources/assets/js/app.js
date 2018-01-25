window.$ = window.jQuery = require('jquery');
import * as Guacamole from 'guacamole-common-js';

let authToken = null;

let Monitoring = {
    /**
     * Get listing of agent screen thumbnails
     */
    getGuacs() {
        $.get('/guac.json', (data) => {
                this.connect(data.agentMachines);
            }
        );
    },

    /**
     * Connecting to tunnel provider
     * @param agentMachines
     */
    connect(agentMachines) {
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
                guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=8&token=${authToken}`);
            }
        );
    }
};

let agentMachines = Monitoring.getGuacs();

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
// End mouse

// Keyboard
let keyboard = new Guacamole.Keyboard(document);

keyboard.onkeydown = function(keysym) {
    guacFull.sendKeyEvent(1, keysym);
};

keyboard.onkeyup = function(keysym) {
    guacFull.sendKeyEvent(0, keysym);
};

$('.monitor-thumbnails').on('click', function () {
    let guactId = $(this).data('id');
    switchView(guactId);
});

function switchView(guacId) {
    guacFull.disconnect();
    guacFull.connect(`GUAC_DATA_SOURCE=mysql&GUAC_TYPE=c&GUAC_ID=${guacId}&token=${authToken}`);
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