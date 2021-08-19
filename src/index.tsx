import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { CitrixPanel, CPPPanel } from './components';

import * as channel from './channel';
import * as ws from './ws';

async function init() {
    if (typeof fin === 'undefined') {
        console.error('this app can only run in an OpenFin environment');
        return;
    }

    const app = fin.Application.getCurrentSync();

    const params = new URLSearchParams(window.location.search);
    const wsUrl = params.get('wsurl');
 
    await channel.initProvider(app.identity.uuid);

    const handleClose = () => {
        console.error('websocket closed');
    }
    await ws.connect(wsUrl).catch((err) => {
        console.error('closing due to websocket connection error: ', err);
    });
    console.log('connected to ', wsUrl);
    ws.addEventListener('close', handleClose);
    ws.addEventListener('packet', async (packet) => {
        channel.publish(packet);
    });

    ReactDOM.render(
        <CitrixPanel/>,
        document.getElementById('citrix')
    );
    ReactDOM.render(
        <CPPPanel/>,
        document.getElementById('cpp')
    );

}

window.addEventListener('DOMContentLoaded', init);
