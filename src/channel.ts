import * as console from './console';
import type { ChannelProvider, Identity } from 'openfin-adapter';

import * as ws from './ws';

let provider: ChannelProvider;

type CEvent = 'packet';
const listeners: Map<CEvent, Set<(...args: any[]) => void>> = new Map();

const emit = (event: CEvent, ...args: any[]) => {
    const evListeners = listeners.get(event) || new Set();
    evListeners.forEach((listener) => listener(...args));
};
export function addEventListener(event: CEvent, listener: (...args: any[]) => void) {
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event).add(listener);
}


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
        emit('packet', payload);
    });
    console.debug('created channel provider', name);
}

export const publish = (payload: any) => {
    provider.publish('proxy-ctx-request', payload);
};