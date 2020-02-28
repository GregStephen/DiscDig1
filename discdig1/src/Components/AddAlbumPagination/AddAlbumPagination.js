import React from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import './AddAlbumPagination.scss';

class AddAlbumPagination extends React.Component {

  handleClick(e, page) {
    e.preventDefault();
    const { changePage } = this.props;
    changePage(page);
  }

  // when there is fewer than 10 pages of information
  // then this function will be called
  createSmallerThan10Pagination = () => {
    const { currentPage, totalPages } = this.props;
    const arrayOfPages = [...Array(totalPages)];
    let pagesToReturn;

    // this creates the initial array of page number items
    pagesToReturn = arrayOfPages.map((page, i) =>
      <PaginationItem active={i + 1 === currentPage} key={i + 1}>
        <PaginationLink onClick={e => this.handleClick(e, i + 1)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    )
    // this puts the 'previous' item to the beginning of the array
    pagesToReturn.unshift(
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          onClick={e => this.handleClick(e, currentPage - 1)}
          previous
          href="#"
        />
      </PaginationItem>
    )
    // this puts the 'next' item at the end of the array
    pagesToReturn.push(
      <PaginationItem disabled={currentPage >= totalPages}>
        <PaginationLink
          onClick={e => this.handleClick(e, currentPage + 1)}
          next
          href="#"
        />
      </PaginationItem>
    )
    return pagesToReturn;
  }


  // if the results have more than 10 pages this gets called, adding the 'etc' item where needed
  // as well as adding the 'first' and 'last' items
  createLargerThan10Pagination = () => {
    const { currentPage, totalPages } = this.props;
    let arrayOfPages = [...Array(10)];
    let pagesToReturn;
    // if the current page is less than 6, then you will have an 'etc' item pushed at the end after 10
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
    // if the current page is OVER 6 and less than the total pages - 5 
    // than you would have the 'etc' item at the front and the end
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
    // if your current page is closer to the end than you will 
    // only have an 'etc' item at the beginnint
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

    // then we add the 'previous' item to the beginning of the array
    pagesToReturn.unshift(
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          onClick={e => this.handleClick(e, currentPage - 1)}
          previous
          href="#"
        />
      </PaginationItem>
    )
    // then we add the 'first' item to the beginning of the array
    pagesToReturn.unshift(
      <PaginationItem disabled={currentPage <= 1}>
        <PaginationLink
          onClick={e => this.handleClick(e, 1)}
          first
          href="#"
        />
      </PaginationItem>
    )
    // adds the 'next' item to the end of the array
    pagesToReturn.push(
      <PaginationItem disabled={currentPage >= totalPages}>
        <PaginationLink
          onClick={e => this.handleClick(e, currentPage + 1)}
          next
          href="#"
        />
      </PaginationItem>
    )
    // adds the 'last' item to the end of the array
    pagesToReturn.push(
      <PaginationItem disabled={currentPage >= totalPages}>
        <PaginationLink
          onClick={e => this.handleClick(e, totalPages)}
          last
          href="#"
        />
      </PaginationItem>
    )

    return pagesToReturn;
  }

  render() {
    const { totalPages } = this.props;
    const arrayOfPages = [...Array(totalPages)];
    return (
      <div className="AddAlbumPagination col">
        <Pagination aria-label="Page navigation">
          {arrayOfPages.length > 10 ?
            this.createLargerThan10Pagination()
            :
            this.createSmallerThan10Pagination()
          }
        </Pagination>
      </div>
    )
  }
};

export default AddAlbumPagination;
