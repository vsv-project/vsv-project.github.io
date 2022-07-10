/* eslint-disable @typescript-eslint/no-shadow */
import { useState,  useEffect} from "react";
import {
  useLocation,
} from "react-router-dom";
import {
  getRef,
} from "./firebase/functions/database";
import {
  useAuthProvider,
} from "./firebase/context/auth"
import "./channels.scss"
import { onValue, set, push } from "firebase/database";
import { Stack, Form, Button } from "react-bootstrap";

export const Channel = () => {
  const location = useLocation();
  const [state, setState] = useState({})
  useEffect(() => {
    setState(location)
    console.log(location)
  }, [location])
  return (
    <>
    {JSON.stringify(state)}
    </>
  )
}



export function Channel2() {
  const location = useLocation();
  const user = useAuthProvider();
  const [channel, setChannel] = useState<any | undefined>(null);
  const [messages, setMessages] = useState<any | undefined>(null);
  const [error, setError] = useState<any | undefined>(null);
  const [message, setMessage] = useState<string>("");
  const channelRef = getRef(`/channels/${location.pathname.split("/")[2]}`);
  const newMessageRef = push(getRef(`/channels/${location.pathname.split("/")[2]}/messages`));

  const sendMessage = (message: any) => {
    set(newMessageRef, {
      text: message,
      timestamp: new Date().valueOf(),
      name: user.email,
    });
  };
  const setNewMessage = (event: any) => {
    setMessage(event.target.value);
  }
  useEffect(() => {
    console.log("channel", channel);
    if (!user) {
      console.log(user);
      setError({ error: "Not logged in" });
    } else {
      const unsubscribe = onValue(
        channelRef,
        (snapshot) => {
          console.log(snapshot);
          const messages = snapshot.child("messages");
          const list: any = [];
          messages.forEach((childSnapshot) => {
            let data = { key: childSnapshot.key, ...childSnapshot.val() };
            list.push(data);
          });
          setMessages(list);
          setChannel(snapshot.val());
          setError(null);
        },
        (error) => {
          console.error(error);
          setError(error);
        }
      );
      return unsubscribe
    }
  }, [user]);
  return (
    <div className="testwrapper">
      {error ? <p>{error.code}</p> : null}
      {channel !== null && channel !== undefined && !error ? (
        <>
          <>
            <h1>Channel: {channel.name}</h1>
            <div className="test2">
              <Stack gap={3}>
                {messages.map((m: any, i: number) => (
                  <div key={i} className="message">
                    <span className="timestamp">
                      ({new Date(
                        new Date(m.timestamp).setMinutes(
                          new Date(m.timestamp).getMinutes() -
                            new Date(m.timestamp).getTimezoneOffset()
                        )
                      ).toUTCString()})
                    </span>
                    <span className="user">
                      {m.name}:
                    </span>
                    <div className="text">
                      {m.text}
                    </div>  
                  </div>
                ))}
              </Stack>
            </div>
          </>
          <Form>
            <input
              type="text"
              name="message"
              id="message"
              placeholder="..."
              value={message}
              onChange={setNewMessage}
            />
            <Button type="button" onClick={() => {
              sendMessage(message);
              setMessage("");
            }}>
              Send message
            </Button>
          </Form>
        </>
      ) : null}
    </div>
  );
};
