import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap'
import Navbar from '../../components/Navbar';
import Pagination from '../../components/Pagination';
import SkeletonImageList from '../../components/Skeleton/ImageList';

import api from '../../api/client';

import './style.css';

const PAGE_SIZE = 4;

function ImageList() {
  const [page, setPage] = useState(1);
  const [images, setImages] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);


  const fetchImages = async (page) => {
    try {
      const offset = (page - 1) * PAGE_SIZE;
      const limit = PAGE_SIZE;

      setLoading(true);

      const res = await api.get('/posts', { params: { offset, limit } });
      if (res && res.success) {
        const { images, total } = res.data;
        setLoading(false);
        setImages(images);
        setTotal(total);
        setPage(page);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchImages(1)
  }, []);

  const onChangePage = (page) => {
    fetchImages(page);
  }

  const renderImages = (images) => {
    return images.map(image => (
      <Col className="mb-4" xs="12" md="3" key={image._id}>
        <Card>
          <Link to={`/posts/${image._id}`}>
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
          {loading && <SkeletonImageList />}
          {!loading && (
            <Row className="mt-4">
              {renderImages(images)}
            </Row>
          )}

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
