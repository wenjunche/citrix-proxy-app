import * as console from './console';

import { Packet } from './packet';

let wsUrl: string;

let ws: WebSocket;
let reconnectPromise: Promise<void>;

const isConnectedOrFail = async () => {
    await reconnectPromise;
    if (ws) return;
    throw new Error('web socket not connected');
};

type WEvent = 'close' | 'packet';
const listeners: Map<WEvent, Set<(...args: any[]) => void>> = new Map();

/**
 * Emit an event.
 * @param event the event to emit.
 * @param args the args to pass with the event emission.
 */
const emit = (event: WEvent, ...args: any[]) => {
    const evListeners = listeners.get(event) || new Set();
    evListeners.forEach((listener) => listener(...args));
};

/**
 * Handle a message from the Virtual App.
 * @param ev the web socket event.
 */
const handleMessage = (ev: MessageEvent<any>) => {
    const packet: Packet = JSON.parse(ev.data);
    console.debug('parsed packet from web socket: ', packet);
    emit('packet', packet);
};

const connectTimeout = 4000;

const handleConnect = () => {
    const newWS = new WebSocket(wsUrl);
    return new Promise<void>((res, rej) => {
        let timeout: any;
        const removeListeners = () => {
            clearTimeout(timeout);
            newWS.removeEventListener('open', onRes);
            newWS.removeEventListener('error', onRej);
            newWS.removeEventListener('close', onRej);
        };
        const onRes = () => {
            removeListeners();
            ws = newWS;
            ws.addEventListener('close', () => {
                reconnectPromise = handleReconnect();
            });
            ws.addEventListener('message', (ev) => handleMessage(ev));
            res();
        };
        const onRej = (err: Event): void => {
            newWS.close();
            removeListeners();
            rej(err);
        };
        timeout = setTimeout(onRej, connectTimeout);
        newWS.addEventListener('open', onRes);
        newWS.addEventListener('error', onRej);
        newWS.addEventListener('close', onRej);
    });
};

const maxAttempt = 3;
const attemptTimeout = 1000;

/**
 * Attempt to reconnect the socket if it disconnects.
 * @param attempt the number of times reconnection was attempted.
 */
const handleReconnect = async (attempt = 0): Promise<void> => {
    const res = await handleConnect().catch((err) => err);
    if (res) {
        if (attempt < maxAttempt) {
            console.debug('connection failed, retrying...');
            await new Promise((res) => setTimeout(res, attemptTimeout));
            return handleReconnect(attempt + 1);
        } else {
            ws = undefined;
            emit('close');
        }
    }
};

/**
 * Connect to a Virtual App.
 * @param reqIP the ip of the Virtual App.
 * @param reqPort the port of the Virtual App.
 * @param reqParams the parameters to pass along in the connection request.
 */
export const connect = (reqWsUrl: string) => {
    wsUrl = reqWsUrl;
    return handleReconnect();
};

export function addEventListener(event: 'packet', listener: (packet: Packet) => void): void;
export function addEventListener(event: 'close', listener: () => void): void;
export function addEventListener(event: WEvent, listener: (...args: any[]) => void) {
    isConnectedOrFail();
    if (!listeners.has(event)) {
        listeners.set(event, new Set());
    }
    listeners.get(event).add(listener);
}

/**
 * Send a packet through the connected web socket.
 * @param packet the packet to send.
 */
export const send = (packet: Packet) => {
    isConnectedOrFail();
    console.debug('sending packet: ', packet);
    const str = JSON.stringify(packet);
    ws.send(str);
};
