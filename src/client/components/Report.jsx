import React, { Component, PropTypes } from 'react';
import connect from '../util/connect';
import './Report.styl';

class Report extends Component {

  static propTypes = {
    data: PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      data: props.data || []
    };
  }

  render() {
    let data = [];

    data = this.state.data.map(item => (
      <tr key={item.id}>
        <td>{item.date}</td>
        <td>{item.siteId}</td>
        <td>{item.siteName}</td>
        <td>{item.adSize}</td>
        <td>{item.requests}</td>
        <td>{item.bids}</td>
        <td>{item.impressions}</td>
        <td>${item.revenue}</td>
      </tr>
    ));

    return (
      <div className="sb-report-form">
        <table className="pt-table pt-condensed pt-bordered">
          <tbody>
            <tr>
              <th>Date</th>
              <th>Site Id</th>
              <th>Site Name</th>
              <th>Ad Size</th>
              <th>Requests</th>
              <th>Bids</th>
              <th>Impressions</th>
              <th>Revenue</th>
            </tr>
            {data}
          </tbody>
        </table>
      </div>
    );
  }
}

export default connect(Report);
