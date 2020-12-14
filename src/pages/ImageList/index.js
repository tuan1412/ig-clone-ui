import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap'
import Navbar from '../../components/Navbar';
import api from '../../api/client';

import './style.css';
import Pagination from '../../components/Pagination';

const PAGE_SIZE = 4;

function ImageList() {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);

  const fetchImages = async (page) => {
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const limit = PAGE_SIZE;

      const res = await api.get('/images', { params: { offset, limit } });
      if (res && res.success) {
        const { images, total } = res.data;
        setImages(images);
        setTotal(total);
        setPage(page)
      }
    } catch (error) {
      console.log(error);
    }
  }

  useState(() => {
    fetchImages(1)
  }, []);

  const onChangePage = (page) => {
    fetchImages(page);
  }

  const renderImages = (images) => {
    return images.map(image => (
        <Col className="mb-4" xs="12" md="3" key={image._id}>
          <Card>
            <Link to={`/images/${image._id}`}>
              <Card.Img variant="top" src={image.url} />
            </Link>
            <Card.Body>
              <Card.Title>{image.title}</Card.Title>
              <Card.Text>
                {image.description}
              </Card.Text>
              <Card.Text className="text-muted">
                {image.createdBy.username}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
    ))
  }

  return (
    <div className="ImageList">
      <Navbar />
      <Container className="pb-4">
        <div className="image-container">
          <Row className="mt-4">
            {renderImages(images)}
          </Row>
        </div>
        <Pagination
          page={page}
          total={total}
          pageSize={PAGE_SIZE}
          onChangePage={onChangePage}
        />
      </Container>
    </div>
  )
}

export default ImageList;
