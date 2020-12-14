import { Row, Col, Card } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

function SkeletonImageList() {
  const SkeletonCard = (
    <Col className="mb-4" xs="12" md="3">
      <Card>
        <Skeleton height={350} />
        <Card.Body>
          <Card.Title><Skeleton /></Card.Title>
          <Card.Text>
            <Skeleton count="2" />
          </Card.Text>
          <Card.Text className="text-muted">
            <Skeleton />
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  )

  return (
    <Row className="mt-4">
      {SkeletonCard}
      {SkeletonCard}
      {SkeletonCard}
      {SkeletonCard}
    </Row>
  )

}

export default SkeletonImageList;