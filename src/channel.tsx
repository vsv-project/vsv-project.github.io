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
import { onValue, update, push, off, set, onChildAdded, query, orderByChild } from "firebase/database";
import { Stack, Form, Button, Row, Col, Container } from "react-bootstrap";

export const Channel = () => {
  const location = useLocation();
  const user = useAuthProvider();
  const [channel, setChannel] = useState(location.pathname.split("/c/")[1])
  const [messages, setMessages] = useState<Array<any>>([])
  const [error, setError] = useState<any>(null)
  const [message, setMessage] = useState<string>("")

  const sendMessage = (channel: any, message: string) => {
    const newMessageRef = push(getRef());
    const newMessageKey = newMessageRef.key;
    const updates: any = {};
    updates[`/channels/${channel}/latestMessage`] = {
      key: newMessageKey,
      timestamp: Date.now(),
      text: message,
      name: user.email
    };
    updates[`/messages/${channel}/${newMessageKey}`] = {
      timestamp: Date.now(),
      text: message,
      name: user.email,
      key: newMessageKey
    };
    update(getRef(), updates)
      .then(() => {
        console.log("update successful")
      })
      .catch((error) => {
        console.log(error)
        setError(error)
      })
  }

  useEffect(() => {
    console.log("component mounted")
    return () => {console.log("component unmounted")}
  }, [])

  useEffect(() => {
    off(getRef(`/messages/${channel}`))
    setMessages([])
    setError(null)
    console.log(location.pathname.split("/c/")[1])
    setChannel(location.pathname.split("/c/")[1]);
    onChildAdded(query(getRef(`/messages/${location.pathname.split("/c/")[1]}`), orderByChild('timestamp')), (snapshot) => {
      setError(null)
      console.log(snapshot.val())
      let x = messages
      x.push(snapshot.val())
      setMessages(x)
    }, (error: any) => {
      console.log(error)
      setError({code: error.code, message: error.message})
    })
    return () => {
      off(getRef(`/messages/${location.pathname.split("/c/")[1]}`))
    }
  }, [location])

  return (
    <div className="messagePage">
      <h1>Channel: {channel}</h1>
      {error ? <p>{error.code}: {error.message}</p> : null}
      {messages.length > 0 && messages 
        ?
        <>
          <div className="messages">
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
          <Container fluid >
            <Form onSubmit={(event) => {
              sendMessage(channel, message);
              setMessage("");
              event.preventDefault();
            }}
            className="testing425"
            >
              <Row className="align-items-center">
                <Col>
                  <div>
                    <Form.Control 
                      as="textarea" 
                      placeholder="..." 
                      name="message" 
                      id="message"  
                      value={message}
                      rows={2}
                      onChange={(e) => setMessage(e.target.value)}
                    >
                    </Form.Control>
                  </div>
                </Col>
                <Col md="auto">
                  <Button type="submit" value="Submit">
                    Send message
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </>
        : null
      }
    </div>
  )
}



export function Channel2() {
  const location = useLocation();
  const user = useAuthProvider();
  const [channel, setChannel] = useState(location.pathname.split("/")[2])
  const [channelRef, setChannelRef] = useState(getRef(`channels/${channel}`))
  const [newMessageRef, setNewMessageRef] = useState(push(getRef(`channels/${channel}/messages`)))
  const [channelData, setChannelData] = useState<any | undefined>(null);
  const [messages, setMessages] = useState<any | undefined>(null);
  const [error, setError] = useState<any | undefined>(null);
  const [message, setMessage] = useState<string>("");

  const sendMessage = (message: any) => {
    set(newMessageRef, {
      text: message,
      timestamp: new Date().valueOf(),
      name: user.email,
    });
  };

  useEffect(() => {
    setChannel(location.pathname.split("/")[2])
    setChannelRef(getRef(`channels/${location.pathname.split("/")[2]}`))
    setNewMessageRef(push(getRef(`channels/${location.pathname.split("/")[2]}/messages`)))
  }, [location, user])

  useEffect(() => {
    off(channelRef);
    console.log("channel", channel);
    if (!user) {
      console.log(user);
      setError({ error: "Not logged in" });
    } else {
      const unsubscribe = onValue(
        channelRef,
        (snapshot) => {
          console.log(snapshot);
          let messages = snapshot.child("messages");
          let list: any = [];
          messages.forEach((childSnapshot) => {
            let data = { key: childSnapshot.key, ...childSnapshot.val() };
            list.push(data);
          });
          setMessages(list);
          setChannelData(snapshot.val());
          setError(null);
        },
        (error) => {
          console.error(error);
          setError(error);
        }
      );
      return () => {
        unsubscribe()
      }
    }
  }, [user, location]);
  return (
    <div className="testwrapper">
      {error ? <p>{error.code}: {error.message}</p> : null}
      {channelData !== null && channelData !== undefined && !error ? (
        <>
          <>
            <h1>Channel: {channelData.name}</h1>
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
              onChange={(e) => setMessage(e.target.value)}
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
