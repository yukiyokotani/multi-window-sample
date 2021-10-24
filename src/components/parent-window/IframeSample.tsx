import React, { useCallback, useEffect, useState } from 'react';

type Message =
  | {
      type: 'message';
      body: {
        message: string;
      };
    }
  | {
      type: 'status';
      status: 'SUCCESS';
    };

const IframeSample: React.FC = () => {
  const [message, setMessage] = useState('Initialized');
  const [count, setCount] = useState(0);

  const iframeRef = React.createRef<HTMLIFrameElement>();

  const postHello = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'message',
      body: { message: 'Hello Child Window!' },
    });
  }, [iframeRef]);

  const postGoodbye = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage({
      type: 'message',
      body: { message: 'Goodbye Child Window!' },
    });
  }, [iframeRef]);

  useEffect(() => {
    window.addEventListener('message', (event: MessageEvent<Message>) => {
      if (event.data.type === 'message') {
        setMessage(event.data.body.message);
        event.source?.postMessage({
          type: 'status',
          status: 'SUCCESS',
        });
      }
    });
    window.addEventListener('message', (event: MessageEvent<Message>) => {
      if (event.data.type === 'status') {
        setCount((prevCount) => prevCount + 1);
      }
    });
  }, []);

  return (
    <div className="iframe-sample-container">
      <h2 className="iframe-message">{message}</h2>
      <h4>Count: {count}</h4>
      <div className="button-container">
        <button
          className="iframe-post-message-button"
          type="button"
          onClick={postHello}
        >
          postHello
        </button>
        <button
          className="iframe-post-message-button"
          type="button"
          onClick={postGoodbye}
        >
          postGoodbye
        </button>
      </div>
      <div className="iframe-container">
        <iframe
          title="myself-iframe"
          className="myself-iframe"
          ref={iframeRef}
          src={import.meta.env.VITE_BASE_PATH as string}
        />
      </div>
    </div>
  );
};

export default IframeSample;
