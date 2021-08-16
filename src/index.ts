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
//        setTimeout(handleClose, 5000);
    });
    console.log('connected to ', wsUrl);
    ws.addEventListener('close', handleClose);
    ws.addEventListener('packet', async (packet) => {
        channel.publish(packet);
    });
}

window.addEventListener('DOMContentLoaded', init);
