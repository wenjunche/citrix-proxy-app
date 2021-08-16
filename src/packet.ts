export enum PacketType {
    Ack = 'ack',
    ChannelConnect = 'channel-connect',
    ChannelClientDisconnect = 'channel-client-disconnect',
    ChannelClientDispatch = 'channel-client-dispatch',
    ChannelClientRegister = 'channel-client-register',
    ChannelClientRemove = 'channel-client-remove',
    ChannelClientAction = 'channel-client-action',
    ChannelClientOnDisconnection = 'channel-client-on-disconnection',
    ChannelClientDisconnection = 'channel-client-disconnection'
}

export interface PacketBase<T> {
    ack: string;
    type: PacketType;
    data: T;
}

export interface ChannelConnectPayload {
    name: string;
    options: {
        wait: boolean;
        payload: any;
    };
}

export type ChannelConnectPacket = {
    type: PacketType.ChannelConnect;
} & PacketBase<ChannelConnectPayload>;

export interface ChannelClientDisconnectPayload {
    name: string;
}

export type ChannelClientDisconnectPacket = {
    type: PacketType.ChannelClientDisconnect;
} & PacketBase<ChannelClientDisconnectPayload>;

export interface ChannelClientDispatchPayload {
    name: string;
    action: string;
    payload: any;
}

export type ChannelClientDispatchPacket = {
    type: PacketType.ChannelClientDispatch;
} & PacketBase<ChannelClientDispatchPayload>;

export interface ChannelClientRegisterPayload {
    name: string;
    topic: string;
}

export type ChannelClientRegisterPacket = {
    type: PacketType.ChannelClientRegister;
} & PacketBase<ChannelClientRegisterPayload>;

export interface ChannelClientActionPayload {
    name: string;
    topic: string;
    payload: any;
}

export type ChannelClientActionPacket = {
    type: PacketType.ChannelClientAction;
} & PacketBase<ChannelClientActionPayload>;

export interface ChannelClientRemovePayload {
    name: string;
    topic: string;
}

export type ChannelClientRemovePacket = {
    type: PacketType.ChannelClientRemove;
} & PacketBase<ChannelClientRemovePayload>;

export interface ChannelClientDisconnection {
    name: string;
}

export type ChannelClientDisconnectionPacket = {
    type: PacketType.ChannelClientDisconnection;
} & PacketBase<ChannelClientDisconnection>;

export interface ChannelClientOnDisconnectionPayload {
    name: string;
}

export type ChannelClientOnDisconnectionPacket = {
    type: PacketType.ChannelClientOnDisconnection;
} & PacketBase<ChannelClientOnDisconnectionPayload>;

export type AckPacket = PacketBase<any> & {
    type: PacketType.Ack;
    err: string;
};

export type Packet = {
    subjec: string
};
