import React from 'react';
import './app.css';
import Countries from 'countries-api';
import CountryCard from './components/country';
//import Pagination from './components/pagination';
import Paginator from './components/paginate';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCountries: [],
      currentCountries: [],
      currentPage: 1,
      totalPages: null,
    };
    this.onPageChanged = this.onPageChanged.bind(this);
  }
  componentDidMount() {
    const {data: allCountries = []} = Countries.findAll();
    this.setState({allCountries});
  }

  onPageChanged(data) {
    const {allCountries} = this.state;
    const {currentPage, totalPages, limit} = data;
    const offset = (currentPage - 1) * limit;
    const currentCountries = allCountries.slice(offset, offset + limit);
    this.setState({currentPage, currentCountries, totalPages});
  }

  render() {
    const {
      allCountries,
      currentCountries,
      currentPage,
      totalPages,
    } = this.state;
    const totalCountries = allCountries.length;

    if (totalCountries === 0) return null;
    const border = currentPage ? 'border-gray border-right' : '';
    const headers = ['text-dark py-2 pr-4 m-0', border];
    const headerClass = headers.join(' ').trim();
    return (
      <div className="App">
        <div className="container mb-5">
          <div className="row d-flex flex-row py-5">
            <div className="w-100 px-4 py-5 d-flex flex-row flex-wrap align-items-center justify-content-between">
              <div className="d-flex flex-row align-items-center">
                <h2 className={headerClass}>
                  <strong className="text-secondary">{totalCountries}</strong>{' '}
                  Countries
                </h2>
                {currentPage && (
                  <span className="current-page d-inline-block h-100 pl-4 text-secondary">
                    Page <span className="font-weight-bold">{currentPage}</span>{' '}
                    / <span className="font-weight-bold">{totalPages}</span>
                  </span>
                )}
              </div>
              <div className="d-flex flex-row py-4 align-items-center">
                <Paginator
                  records={totalCountries}
                  limit={18}
                  //nextPages={1}
                  onPageChanged={this.onPageChanged}
                />
              </div>
            </div>
            {currentCountries.map((country) => (
              <CountryCard key={country.cca3} country={country} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
