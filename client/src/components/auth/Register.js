import React, { Fragment, useState } from 'react'

//whenever you use connect you have to export it and the name of the component goes in it
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
// redux action to make request ot backend, testing
// import axios from 'axios';
import { setAlert } from '../../actions/alert';
import PropTypes from 'prop-types'


const Register = ({ props }) => {


    //formData, setFormData this will be your state 
    // useState(4) returns an array of 2 values, they usualy destructure in line 
    // const [count, setCount] = useState(4)
    // first value is your state, the current state at every iteration
    // second value is a function to update your state
    // useState(4) sets current state 

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    });

    const { name, email, password, password2 } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
            //in App.css .alert-danger can be dynamic 
            // console.log('Passwords do not match', 'danger');
            setAlert('Passwords do not match', 'danger');
        } else {
            console.log('SUCCESS');
            // console.log(formData);
            // hitting the users route POST api/users
            // const newUser = {
            //     name,
            //     email,
            //     password
            // };

            // try {
            //     // since we're sending data, we want config data, with headers object
            //     // const config = {
            //     //     headers: {
            //     //         'Content-Type': 'application/json'
            //     //     }
            //     // };

            //     // // Body to send data 
            //     // const body = JSON.stringify(newUser);

            //     // response, axioss returns promise
            //     //body is the data, config is the header
            //     // const res = await axios.post('api/users', body, config);
            //     //Don't need body/config since this is already default by axios
            //     const res = await axios.post('api/users', newUser);
            //     console.log(res.data); // should return token
            // } catch (err) {
            //     console.error(err.response.data);
            // }
        }
    }




    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}>
                    <div className="form-group">
                        <input
                            type="text"
                            placeholder="Name"
                            name="name"
                            value={name}
                            onChange={e => onChange(e)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="Email Address"
                            name="email"
                            value={email}
                            onChange={e => onChange(e)}
                            required
                        />

                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            value={password}
                            onChange={e => onChange(e)}
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            value={password2}
                            onChange={e => onChange(e)}
                            minLength="6"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <Link to="/login">Sign In</Link>
                </p>
            </section>
        </Fragment>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    /* import PropTypes from 'prop-types' */
};

{/* This will allow us to access props.alert add props to Register up top*/ }
export default connect(null, { setAlert })(Register);