import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './AddAlbumPagination.scss';

class AddAlbumPagination extends React.Component {

  handleClick(e, page) {
    e.preventDefault();
    const { changePage } = this.props;
    changePage(page);
  }

  createLargerPagination = () => {
    const { currentPage, totalPages } = this.props;
    let arrayOfPages = [...Array(10)];
    let pagesToReturn;
    if (currentPage < 6) {
      pagesToReturn = arrayOfPages.map((page, i) =>
        <PaginationItem active={i + 1 === currentPage} key={i + 1}>
          <PaginationLink onClick={e => this.handleClick(e, i + 1)} href="#">
            {i + 1}
          </PaginationLink>
        </PaginationItem>
      )
      pagesToReturn.push(
        <PaginationItem disabled key='...end'>
          <PaginationLink href="#">
            ...
        </PaginationLink>
        </PaginationItem>
      )
    }
    else if (currentPage >= 6 && currentPage < (totalPages - 5)) {
      pagesToReturn = arrayOfPages.map((page, i) =>
        <PaginationItem active={(i + 1 + (currentPage - 5)) === currentPage} key={(i + 1 + (currentPage - 5))}>
          <PaginationLink onClick={e => this.handleClick(e, (i + 1 + (currentPage - 5)))} href="#">
            {(i + 1 + (currentPage - 5))}
          </PaginationLink>
        </PaginationItem>
      )
      pagesToReturn.unshift(
        <PaginationItem disabled key='...beginning'>
          <PaginationLink href="#">
            ...
      </PaginationLink>
        </PaginationItem>
      )
      pagesToReturn.push(
        <PaginationItem disabled key='...end'>
          <PaginationLink href="#">
            ...
      </PaginationLink>
        </PaginationItem>
      )
    }
    else if (currentPage >= (totalPages - 5)) {
      pagesToReturn = arrayOfPages.map((page, i) =>
        <PaginationItem active={(i + 1 + (totalPages - 10)) === currentPage} key={(i + 1 + (totalPages - 10))}>
          <PaginationLink onClick={e => this.handleClick(e, (i + 1 + (totalPages - 10)))} href="#">
            {(i + 1 + (totalPages - 10))}
          </PaginationLink>
        </PaginationItem>
      )
      pagesToReturn.unshift(
        <PaginationItem disabled key='...beginning'>
          <PaginationLink href="#">
            ...
      </PaginationLink>
        </PaginationItem>
      )
    }
    return pagesToReturn;
  }

  render() {
    const { currentPage, totalPages } = this.props;
    const arrayOfPages = [...Array(totalPages)];
    return (
      <div className="AddAlbumPagination col">
        <Pagination aria-label="Page navigation">
          <PaginationItem disabled={currentPage <= 1}>
            <PaginationLink
              onClick={e => this.handleClick(e, 1)}
              first
              href="#"
            />
          </PaginationItem>
          <PaginationItem disabled={currentPage <= 1}>
            <PaginationLink
              onClick={e => this.handleClick(e, currentPage - 1)}
              previous
              href="#"
            />
          </PaginationItem>

          {arrayOfPages.length > 10 ?

            // this is when it needs to have the ... on the end that has it
            this.createLargerPagination()
            :
            arrayOfPages.map((page, i) =>
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
          <PaginationItem disabled={currentPage >= totalPages}>
            <PaginationLink
              onClick={e => this.handleClick(e, totalPages)}
              last
              href="#"
            />
          </PaginationItem>
        </Pagination>
      </div>
    )
  }
};

export default AddAlbumPagination;
