import { useMemo } from 'react';
import { Pagination } from 'react-bootstrap';

function CustomPagination({ page, total, pageSize = 8, onChangePage }) {
  const pageItems = useMemo(() => {
    const maxPage = Math.ceil(total / pageSize);
    const active = page;
    const items = [];

    for (let number = 1; number <= maxPage; number++) {
      items.push(
        <Pagination.Item key={number} active={number === active} onClick={() => {
          if (page !== number) {
            onChangePage(number)
          }
        }}>
          {number}
        </Pagination.Item>,
      );
    }

    return items;
  }, [page, total, pageSize]);

  return (
    <div>
      <Pagination>{pageItems}</Pagination>
    </div>
  )
}

export default CustomPagination;