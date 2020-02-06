import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './CollectionPagination.scss';

class CollectionPagination extends React.Component {

  handleClick(e, page) {
    e.preventDefault();
    const {changePage} = this.props;
    changePage(page);
  }

  render() {
    const { currentPage, totalPages } = this.props;
    const arrayOfPages = [...Array(totalPages)];
    return (
      <div className="AddAlbumPagination col">
        <Pagination aria-label="Page navigation">
          <PaginationItem disabled={currentPage <= 1}>
            <PaginationLink
              onClick={e => this.handleClick(e, currentPage - 1)}
              previous
              href="#"
            />
          </PaginationItem>

        {arrayOfPages.map((page, i) =>
            <PaginationItem active={i + 1 === currentPage} key={i + 1}>
              <PaginationLink onClick={e => this.handleClick(e, i + 1)} href="#">
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem disabled={currentPage >= totalPages}>
            <PaginationLink
              onClick={e => this.handleClick(e, currentPage + 1)}
              next
              href="#"
            />
          </PaginationItem>
        </Pagination>
      </div>
    )
  }
};

export default CollectionPagination;
