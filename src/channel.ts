import * as console from './console';
import type { ChannelProvider, Identity } from 'openfin-adapter';

import * as ws from './ws';

let provider: ChannelProvider;

export const initProvider = async(name: string) => {
    provider = await fin.InterApplicationBus.Channel.create(name);
    provider.onConnection((idenity: Identity, payload: any) => {
        console.debug('Channel Client connected', idenity);
    });
    provider.onDisconnection((identify: Identity) => {
        console.debug('Channel Client disconnected', identify);
    });

    provider.register('proxy-request', (payload: any,  identity: Identity) => {
        ws.send(payload);
    });
    console.debug('created channel provider', name);
}

export const publish = (payload: any) => {
    provider.publish('proxy-ctx-request', payload);
};