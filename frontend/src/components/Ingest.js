import { API_URL } from '../config';
import React, { useState } from 'react';

const Ingest = () => {
  const [progressMsg, setProgressMsg] = useState('')

  const triggerIngest = () => {
    setProgressMsg('')
    const eventSource = new EventSource(`${API_URL}/ingest`);

    eventSource.onmessage = (event) => {
      if (event.data === 'Ingest Complete!') {
        eventSource.close();
      }
      setProgressMsg(prev => prev + '\n' + event.data);
    };

    eventSource.onerror = (err) => {
      console.error('Error with ingest.', err);
      eventSource.close();
      setProgressMsg(prev => prev + '\nError during ingest.');
    };
  };


  return (
    <div>
      <h1 className='page-title'>Top Secret Ingest Page</h1>
      <p>WARNING! This will wipe any 'favourites' you have already marked.</p>
      <button onClick={triggerIngest}>Trigger Ingest</button>
      {progressMsg && <div><pre>{progressMsg}</pre></div>}
    </div>
  );
};

export default Ingest;