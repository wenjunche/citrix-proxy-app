const params = new URLSearchParams(window?.location?.search || '');
const isDebugEnabled = true; // params.get('debug') === 'true';

export const debug = (msg: string, ...args: any[]) => {
    if (isDebugEnabled) console.debug(msg, ...args);
};
