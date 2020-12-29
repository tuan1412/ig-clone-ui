import { useEffect, useState, useRef } from 'react';
import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import { useAuth, useSocket } from '../../App';

import api from '../../api/client';

import './style.css';
import SkeletonDetailImage from '../../components/Skeleton/DetailImage';

const DetailImage = () => {
  const { user } = useAuth();
  const socket = useSocket();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [hasSomeoneTyping, setHasSomeoneTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const firstRenderCmt = useRef(false);
  const typing = useRef(false);

  const emitTyping = () => {
    if (!typing.current) {
      socket.emit('typing-comment', id);
      typing.current = true;
    }
  }

  const emitStopTyping = () => {
    typing.current = false;
    socket.emit('stop-typing-comment', id);
  }

  const fetchDetailImage = async (id) => {
    setLoading(true);
    const res = await api.get(`/images/${id}`);
    setLoading(false);
    if (res.success) {
      firstRenderCmt.current = true;
      setImage(res.data);
      setComments(res.data.comments);
    }
  }

  const scrollToBottom = () => {
    if (messagesEndRef.current && !firstRenderCmt.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    } else {
      firstRenderCmt.current = false;
    }
  }

  useEffect(() => {
    if (socket && user) {
      socket.emit('request-comment', id);
      socket.on('typing', () => setHasSomeoneTyping(true));
      socket.on('stop-typing', () => setHasSomeoneTyping(false));
      socket.on('new-comment', (newComment) => setComments((comments) => [...comments, newComment]));
    }
    return () => {
      socket.off('typing-comment');
      socket.off('stop-typing-comment');
      socket.off('new-comment');
    }
  }, [socket, id, user]);

  useEffect(() => {
    fetchDetailImage(id);
  }, [id]);

  useEffect(scrollToBottom, [comments]);

  const onChangeComment = (event) => {
    const content = event.target.value;
    if (content) {
      emitTyping()
    } else {
      emitStopTyping();
    }
    setComment(content);
  }

  const onPushComment = async (event) => {
    event.preventDefault();

    if (image && image._id) {
      const res = await api.post('/comments', {
        content: comment,
        imageId: image._id
      })
      if (res.success) {
        const newComment = res.data;
        setComment('');
        setComments([...comments, newComment]);
        socket.emit('show-comment', id, newComment)
        socket.emit('stop-typing-comment', id);
      }
    }
  }

  const renderComments = (comments) => {
    return comments.map(comment => {
      const { content, createdBy, _id } = comment;
      return (
        <div className="comment-card" key={_id}>
          <div>
            <span className="comment-username">{createdBy.username}</span>:
            <span className="text-muted"> {content}</span>
          </div>
        </div>
      );
    })
  }

  return (
    <div className="DetailImage">
      <Navbar />
      <Container className="pb-4">
        <div className="image-container">
          <Row className="justify-content-center">
            {loading && <SkeletonDetailImage />}
            {(!loading && image) && (
              <Col xs="12" md="8">
                <div className="detail-card-wrapper">
                  <Row noGutters className="mt-4">
                    <Col xs="12" md="6">
                      <Card>
                        <Card.Img variant="top" src={image.url} />
                      </Card>
                    </Col>
                    <Col xs="12" md="6">
                      <div className="comment-wrapper p-3 d-flex flex-column">
                        <div className="comment-content flex-grow-1">
                          {renderComments(comments)}
                          {hasSomeoneTyping && <div>Someone is typing...</div>}
                          <div ref={messagesEndRef} />
                        </div>
                        {user && (
                          <div className="comment-footer">
                            <Form onSubmit={onPushComment}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  name="comment"
                                  placeholder="Enter your comment..."
                                  value={comment}
                                  onChange={onChangeComment} />
                              </Form.Group>
                            </Form>
                          </div>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            )}
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default DetailImage;
