import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Container, Row, Col, Form } from 'react-bootstrap';

import clsx from 'classnames';
import Button from '../../components/Button';
import ImageUploader from 'react-images-upload';
import Navbar from '../../components/Navbar';
import api from '../../api/client';
import { storage } from '../firebase';

import './style.css';

function UploadImage() {
  const [picture, setPicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const { title, description } = form;

  const history = useHistory();

  const handleInputForm = (event) => {
    const { name, value } = event.target;
    setForm({
      ...form,
      [name]: value
    });
  };

  const onDrop = pictures => {
    setPicture(pictures[0]);
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = storage.ref();
      const thisRef = storageRef.child(file.name);

      const task = thisRef.put(file);
      const taskProgress = () => {};
      const taskError = reject;
      const taskCompleted = () => {
        task.snapshot.ref
          .getDownloadURL()
          .then(resolve)
          .catch(reject);
      };
      task.on('state_changed', taskProgress, taskError, taskCompleted);
    })
  }

  const handleUploadFile = async (event) => {
    event.preventDefault();
    if (title && description && picture) {
      setLoading(true);
      const imageUrl = await uploadFile(picture);
      if (imageUrl) {
        const resSubmitForm = await api.post('/posts', { title, url: imageUrl, description });
        setLoading(false);
        if (resSubmitForm.success) {
          history.push('/');
        }
      }
    }
  }

  const clsUpload = clsx({
    'has-picture': picture,
    'upload-input': true
  });

  return (
    <div className="UploadImage">
      <Navbar />
      <Container>
        <div className="upload-container mt-4 p-4">
          <Row>
            <Col xs="12" md="4">
              <ImageUploader
                className={clsUpload}
                onChange={onDrop}
                imgExtension={['.jpg', '.gif', '.png', '.gif']}
                maxFileSize={5242880}
                singleImage={true}
                withPreview={true}
                withLabel={false}
              />
            </Col>
            <Col xs="12" md="8">
              <Form onSubmit={handleUploadFile}>
                <Form.Group>
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Title..."
                    name="title"
                    value={title}
                    onChange={handleInputForm}
                    required
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Description..."
                    name="description"
                    value={description}
                    onChange={handleInputForm}
                    required
                  />
                </Form.Group>
                <Button loading={loading} variant="primary" type="submit">
                  Upload
                </Button>
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default UploadImage;