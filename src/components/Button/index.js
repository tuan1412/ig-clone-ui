import { Button } from 'react-bootstrap';

function CustomButton({ loading, children, ...props}) {
  return (
    <Button className=""{...props} disabled={loading}>
      {loading ? <span>Loading...</span> : children}
    </Button>
  )
}

export default CustomButton;
