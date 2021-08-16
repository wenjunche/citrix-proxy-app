import * as ack from './ack';
import * as channels from './channel';

import { PacketType, Packet } from './packet';

const switchAction = async (packet: Packet) => {
    return channels.clientDispatch(packet.data.name, packet.data.action, packet.data.payload);
};

export default async function handlePacket(packet: Packet): Promise<Packet | undefined> {
    let resError: string;
    let resPayload: any;

    if (packet.type === PacketType.Ack) {
        ack.resolve(packet.ack, packet);
        return;
    }

    try {
        resPayload = await switchAction(packet);
    } catch (err) {
        resError = err;
    }

    return { ack: packet.ack, type: PacketType.Ack, err: resError, data: resPayload };
}
