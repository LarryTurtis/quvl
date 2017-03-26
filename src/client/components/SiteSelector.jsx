import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import { fetchSites } from '../actions/sites';
import Spinner from '../components/Spinner';

class SiteSelector extends Component {

  static propTypes = {
    fetchSites: PropTypes.func,
    callback: PropTypes.func,
    sites: PropTypes.object
  };

  static actionsToProps = {
    fetchSites
  };

  static stateToProps = state => ({
    sites: state.sites
  });

  constructor(props) {
    super(props);
    this.props.fetchSites();
    this.state = {};
  }

  handleSiteChange = (e) => {
    const selectedSite = e.target.value;
    this.setState({ selectedSite });
    this.props.callback(selectedSite);
  }

  render() {
    const { sites } = this.props;
    const all = <option key="0" value="all">All</option>;

    let options = [all];

    if (sites.isFetching) {
      return <div className="sb-invite-form"><Spinner /></div>;
    }

    if (sites.items) {
      options = [all, ...sites.items.map(item => (
        <option value={item.Id} key={item.Id}>{item.Title}</option>
      ))];
    }

    return (
      <div>
        <label htmlFor="site" className="pt-label pt-inline">
          Site Name:
            <div className="pt-select">
              <select
                name="site"
                required
                onChange={this.handleSiteChange}
              >
                {options}
              </select>
            </div>
        </label>
      </div>

    );
  }
}

export default connect(SiteSelector);
