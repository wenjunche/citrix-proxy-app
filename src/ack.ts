import { AckPacket, PacketType } from './packet';
import { uuid } from './util';

const errTimeout = new Error('request to virtual app timed out');

const acks: Map<string, [(packet: AckPacket) => void, (err: Error) => void]> = new Map();

const ackTimeout = 1000 * 30;

export type AckPromise = Promise<AckPacket> & { id: string };

/**
 * Create a pending acknowledgement.
 * @returns the id of the pending ack and a promise that will block until the ack has been resolved.
 */
export function make(): AckPromise {
    const id = uuid();
    const promise = new Promise<AckPacket>((res, rej) => {
        acks.set(id, [res, rej]);
        setTimeout(() => {
            acks.delete(id);
            rej(errTimeout);
        }, ackTimeout);
    }) as AckPromise;
    promise.id = id;
    return promise;
}

/**
 * Resolve a pending acknowledgement.
 * @param id the id of the pending ack.
 * @param packet the ack packet.
 */
export function resolve(id: string, packet: AckPacket) {
    const funcs = acks.get(id);
    if (!funcs) return;
    const [res, rej] = funcs;
    if (!packet.err) {
        res(packet);
    } else {
        rej(new Error(packet.err));
    }
    acks.delete(id);
}
