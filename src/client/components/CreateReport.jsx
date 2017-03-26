import React, { Component, PropTypes } from 'react';
import { DateRangePicker } from '@blueprintjs/datetime';
import Moment from 'react-moment';
import connect from '../util/connect';
import { fetchReport } from '../actions/report';
import Spinner from '../components/Spinner';
import Callout from '../components/Callout';
import Report from '../components/Report';
import SiteSelector from '../components/SiteSelector';
import ValidationErrors from '../components/ValidationErrors';

import './CreateReport.styl';

const FAILMESSAGE = 'The report could not be retrieved.';
const NOSTARTDATE = { id: 0, message: 'Please supply a start date.' };
const NOENDDATE = { id: 1, message: 'Please supply an end date.' };
const NOSITES = { id: 2, message: 'Please select one or more sites' };

class CreateReport extends Component {

  static propTypes = {
    fetchReport: PropTypes.func,
    report: PropTypes.object
  };

  static actionsToProps = {
    fetchReport
  };

  static stateToProps = state => ({
    report: state.report
  });

  constructor(props) {
    super(props);
    this.state = {
      displayReport: false,
      callout: false,
      selectedSite: '',
      startDate: '',
      endDate: '',
      validationMessages: []
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();

    const options = {
      selectedSite: this.state.selectedSite,
      startDate: this.state.startDate && this.state.startDate.toString(),
      endDate: this.state.endDate && this.state.endDate.toString()
    };

    const validForm = this.validForm(options);

    if (validForm) {
      this.props.fetchReport(options)
        .then(report => {
          if (report.error) {
            this.setState({ callout: { type: Callout.failure, message: FAILMESSAGE } });
          } else {
            this.setState({ displayReport: true });
          }
        });
    }
  }

  validForm(options) {
    const messages = [];
    let valid = true;
    if (!options.selectedSite) {
      messages.push(NOSITES);
    }
    if (!options.startDate) {
      messages.push(NOSTARTDATE);
    }
    if (!options.endDate) {
      messages.push(NOENDDATE);
    }
    if (messages.length) {
      valid = false;
    }
    this.setState({ validationMessages: messages });
    return valid;
  }

  handleDateChange = (dateRange) => {
    this.setState({ startDate: dateRange[0], endDate: dateRange[1] });
  }

  handleSiteChange = (selectedSite) => {
    this.setState({ selectedSite });
  }

  render() {
    const { report } = this.props;
    let reportComponent;
    let callout;
    let validationMessages;
    let startDate = 'No Date';
    let endDate = 'No Date';

    if (this.state.displayReport) {
      reportComponent = (<Report data={report.items} />);
    }

    if (report.isFetching) {
      reportComponent = <div className="sb-create-report-form"><Spinner /></div>;
    }

    if (this.state.callout) {
      callout = (<Callout
        type={this.state.callout.type}
        message={this.state.callout.message}
      />);
    }

    if (this.state.validationMessages.length) {
      validationMessages = (<ValidationErrors>{this.state.validationMessages}</ValidationErrors>);
    }

    if (this.state.startDate) {
      startDate = <Moment format="MM/DD/YYYY">{this.state.startDate}</Moment>;
    }
    if (this.state.endDate) {
      endDate = <Moment format="MM/DD/YYYY">{this.state.endDate}</Moment>;
    }

    return (
      <div>
        {callout}
        <div className="sb-create-report-form">
          <form onSubmit={this.handleSubmit}>
            <h3>Run A Report</h3>
            <DateRangePicker
              maxDate={new Date()}
              onChange={this.handleDateChange}
              allowSingleDayRange="true"
            />
            <div className="sb-create-report-container">
              <div>
                <SiteSelector callback={this.handleSiteChange} />
              </div>
              <div>
                <span className="pt-tag pt-intent-primary pt-large">{startDate}</span>
                <span className="pt-icon-large pt-icon-arrow-right" />
                <span className="pt-tag pt-intent-primary pt-large">{endDate}</span>
              </div>
              <div className="sb-create-report-button">
                <button type="submit" className="pt-button pt-intent-success">Submit</button>
              </div>
            </div>
          </form>
        </div>
        {validationMessages}
        {reportComponent}
      </div>
    );
  }
}

export default connect(CreateReport);
