import * as React from 'react';

import * as channel from './channel';
import * as ws from './ws';

interface Props {
}

export const CitrixPanel: React.FunctionComponent<Props> = ( (props) => {
    const [citrixMessage, setCitrixMessage] = React.useState('');

    React.useEffect(() => {
        ws.addEventListener('packet', async (packet) => {
            channel.publish(packet);
            setCitrixMessage(citrixMessage + '\n' + JSON.stringify(packet));
        });
    
    }, []);

    return (
        <div> 
          <div>
              <textarea id="citrixarea" rows={20}  cols={40} readOnly value={citrixMessage} />
          </div>
        </div>
      );  
});

export const CPPPanel: React.FunctionComponent<Props> = ( (props) => {
    const [cppMessage, setCppMessage] = React.useState('');

    React.useEffect(() => {
        channel.addEventListener('packet', async (packet) => {
            setCppMessage(cppMessage + '\n' + JSON.stringify(packet));
        });
    
    }, []);

    return (
        <div> 
          <div>
              <textarea id="cpparea" rows={20}  cols={40} readOnly value={cppMessage} />
          </div>
        </div>
      );  
});