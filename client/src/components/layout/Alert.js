import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
// anytime you wanna interact a component with redux, you use connect
const Alert = ({ alerts }) =>
    alerts !== null && alerts.length > 0 && alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
            {/* make sure to embed this into app.js  */}
        </div>
    ));

Alert.propTypes = {
    //alert type is now a prop
    alerts: PropTypes.array.isRequired,
}

// We want to get alert state from reduxTool.
//mapStateToProps we want to map the state to props

const mapStateToProps = state => ({
    //alerts is a prop, we call it alerts 
    //root reducer from reducers/index.js 
    //alert is the only reducer we have 
    //get the state in alert
    //alerts = props so thats why we destructured 'alerts' up there 
    alerts: state.alert
})

// Module not found: Can't resolve './components/auth/layout/Alert' in 'C:\Users\17145\Documents\Udemy\devConnector\client\src'
export default connect(mapStateToProps)(Alert);
