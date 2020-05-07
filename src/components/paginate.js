import React from 'react';
import PropTypes from 'prop-types';

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

class Paginator extends React.Component {
  constructor(props) {
    super(props);
    const {records = 0, limit = 10} = props;
    this.limit = typeof limit === 'number' ? limit : 10;
    this.records = typeof records === 'number' ? records : 0;
    this.totalPages = Math.ceil(this.records / this.limit);
    this.state = {currentPage: 1};
    this.getPage = this.getPage.bind(this);
    this.paginate = this.paginate.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getPage(1);
  }

  getPage(page) {
    const {onPageChanged = (f) => f} = this.props;
    const currentPage = Math.max(0, Math.min(page, this.totalPages));
    const data = {
      currentPage,
      totalPages: this.totalPages,
      limit: this.limit,
      records: this.records,
    };
    this.setState({currentPage}, () => onPageChanged(data));
  }

  handleClick(page, e) {
    e.preventDefault();
    this.getPage(page);
  }

  paginate() {
    const totalPages = this.totalPages;
    const currentPage = this.state.currentPage;
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    return range(startPage, endPage);
  }

  render() {
    if (!this.records || this.totalPages === 1) return null;
    const {currentPage} = this.state;
    const pages = this.paginate();
    const HASH = "#";

    return (
        <nav aria-label="Countries Pagination">
          <ul className="pagination">
            {pages.map((page, index) => {
              return (
                <li
                  key={index}
                  className={`page-item${currentPage === page ? ' active' : ''}`}
                >
                  <a
                    className="page-link" href={HASH}
                    onClick={(e) => this.handleClick(page, e)}
                  >
                    {page}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>);
  }
}
Paginator.propTypes = {
  records: PropTypes.number.isRequired,
  limit: PropTypes.number,
  onPageChanged: PropTypes.func,
};
export default Paginator;
