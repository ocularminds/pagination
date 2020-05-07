import React from 'react';

const LEFT_PAGE = 'LEFT';
const RIGHT_PAGE = 'RIGHT';

/**
 * Helper method for creating a range of numbers
 * range(1, 5) => [1, 2, 3, 4, 5]
 */
const range = (from, to, step = 1) => {
  let i = from;
  const range = [];

  while (i <= to) {
    range.push(i);
    i += step;
  }

  return range;
};

class Pagination extends React.Component {
  construction(props) {
    super(props);
    const {records = 0, limit = 10, nextPages = 0} = props;
    this.limit = typeof limit === 'number' ? limit : 10;
    this.records = typeof records === 'number' ? records : 0;
    //next pages can be 0, 1, or 2
    this.nextPages =
      typeof nextPages === 'number' ? Math.max(0, Math.min(nextPages, 2)) : 0;
    this.totalPages = Math.ceil(this.records / this.limit);
    this.state = {currentPage: 1};
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    getPage(1);
  }

  getPage(page){
    const {onPageChanged = f => f } = this.props;
    const currentPage = Math.max(0, Math.min(0,this.totalPages));
    const data = {
      currentPage, 
      totalPages: this.totalPages,
      limit: this.limit,
      records = this.records
    };
    this.setState({currentPage}, ()=> onPageChanged(data))
  }

  handleClick(page, event) {
    event.preventDefault();
    getPage(page);
  }

  handleNext(e) {
    e.preventDefault();
    this.getPage(this.currentPage + (this.nextPages * 2) + 1);
  }

  handlePrevious(e) {
    e.preventDefault();
    this.getPage(this.state.currentPage - (this.nextPages * 2) - 1);
  }

  /**
   * Let's say we have 10 pages and we set nextPages to 2
   * Given that the current page is 6
   * The pagination control will look like the following:
   *
   * (1) < {4 5} [6] {7 8} > (10)
   *
   * (x) => terminal pages: first and last page(always visible)
   * [x] => represents current page
   * {...x} => represents page neighbours
   */
  fetchPageNumbers = () => {
    const totalPages = this.totalPages;
    const currentPage = this.state.currentPage;
    const pageNeighbours = this.nextPages;

    /**
     * totalNumbers: the total page numbers to show on the control
     * totalBlocks: totalNumbers + 2 to cover for the left(<) and right(>) controls
     */
    const totalNumbers = this.nextPages * 2 + 3;
    const totalBlocks = totalNumbers + 2;

    if (totalPages > totalBlocks) {
      const startPage = Math.max(2, currentPage - pageNeighbours);
      const endPage = Math.min(totalPages - 1, currentPage + pageNeighbours);

      let pages = range(startPage, endPage);

      /**
       * hasLeftSpill: has hidden pages to the left
       * hasRightSpill: has hidden pages to the right
       * spillOffset: number of hidden pages either to the left or to the right
       */
      const hasLeftSpill = startPage > 2;
      const hasRightSpill = totalPages - endPage > 1;
      const spillOffset = totalNumbers - (pages.length + 1);

      switch (true) {
        // handle: (1) < {5 6} [7] {8 9} (10)
        case hasLeftSpill && !hasRightSpill: {
          const extraPages = range(startPage - spillOffset, startPage - 1);
          pages = [LEFT_PAGE, ...extraPages, ...pages];
          break;
        }

        // handle: (1) {2 3} [4] {5 6} > (10)
        case !hasLeftSpill && hasRightSpill: {
          const extraPages = range(endPage + 1, endPage + spillOffset);
          pages = [...pages, ...extraPages, RIGHT_PAGE];
          break;
        }

        // handle: (1) < {4 5} [6] {7 8} > (10)
        case hasLeftSpill && hasRightSpill:
        default: {
          pages = [LEFT_PAGE, ...pages, RIGHT_PAGE];
          break;
        }
      }
      return [1, ...pages, totalPages];
    }
    return range(1, totalPages);
  };

  render() {
    if (!this.records || this.totalPages === 1) return null;

    const {currentPage} = this.state;
    const pages = this.fetchPageNumbers();

    return (
      <Fragment>
        <nav aria-label="Countries Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              if (page === LEFT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      aria-label="Previous"
                      onClick={this.handleMoveLeft}
                    >
                      <span aria-hidden="true">&laquo;</span>
                      <span className="sr-only">Previous</span>
                    </a>
                  </li>
                );

              if (page === RIGHT_PAGE)
                return (
                  <li key={index} className="page-item">
                    <a
                      className="page-link"
                      href="#"
                      aria-label="Next"
                      onClick={this.handleMoveRight}
                    >
                      <span aria-hidden="true">&raquo;</span>
                      <span className="sr-only">Next</span>
                    </a>
                  </li>
                );

              return (
                <li
                  key={index}
                  className={`page-item${
                    currentPage === page ? ' active' : ''
                  }`}
                >
                  <a
                    className="page-link"
                    href="#"
                    onClick={this.handleClick(page)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </Fragment>
    );
  }
}
Pagination.propTypes = {
  records: PropTypes.number.isRequired,
  limit: PropTypes.number,
  nextPages: PropTypes.number,
  onPageChanged: PropTypes.func,
};
export default Pagination;
