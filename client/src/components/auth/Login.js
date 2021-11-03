import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'



export const Login = () => {


    //formData, setFormData this will be your state 
    // useState(4) returns an array of 2 values, they usualy destructure in line 
    // const [count, setCount] = useState(4)
    // first value is your state, the current state at every iteration
    // second value is a function to update your state
    // useState(4) sets current state 

    const [formData, setFormData] = useState({

        email: '',
        password: '',

    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });
    const onSubmit = async e => {
        e.preventDefault();

        console.log('SUCCESS');


    }




    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign In</h1>
                <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
                <form className="form" onSubmit={e => onSubmit(e)}>

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

                    <input type="submit" className="btn btn-primary" value="Login" />
                </form>
                <p className="my-1">
                    Don't have an account? <Link to="/register">Sign Up</Link>
                </p>
            </section>
        </Fragment>
    )
}

export default Login;