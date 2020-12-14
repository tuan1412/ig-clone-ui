import { Row, Col, Card } from 'react-bootstrap';
import Skeleton from 'react-loading-skeleton';

function SkeletonDetailImage() {
  return (
    <Col xs="12" md="8">
      <div className="detail-card-wrapper">
        <Row noGutters className="mt-4">
          <Col xs="12" md="6">
            <Card>
              <Skeleton height={350} />
            </Card>
          </Col>
          <Col xs="12" md="6">
            <div className="comment-wrapper p-3 d-flex flex-column">
              <div className="comment-content flex-grow-1">
                <Skeleton count={5}/>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Col>
  )

}

export default SkeletonDetailImage;