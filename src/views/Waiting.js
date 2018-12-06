import PropTypes from 'prop-types';
import React, {Component} from 'react';

class WaitingView extends Component {
  render() {
    return (
      <div>
        <h1>Waiting for approval</h1>
        <p>Open your device that controls this ID and approve this connection</p>
        <p>{this.props.identity.name}</p>
        <button onClick={this.props.onCancelClick.bind(this)}> Cancel request </button>
      </div>
    );
  }
}

WaitingView.propTypes = {
  identity: PropTypes.object,
  onCancelClick: PropTypes.func,
  onAccountRecoveryClick: PropTypes.func
};

export default WaitingView;
