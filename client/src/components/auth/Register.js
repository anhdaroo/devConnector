import React, { Fragment, useState } from 'react'

export const Register = () => {


    //formData, setFormData this will be your state 
    // useState(4) returns an array of 2 values, they usualy destructure in line 
    // const [count, setCount] = useState(4)
    // first value is your state, the current state at every iteration
    // second value is a function to update your state
    // useState(4) sets current state 

    const [formData, setFormData] = useState();




    return (
        <Fragment>
            <section className="container">
                <h1 className="large text-primary">Sign Up</h1>
                <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
                <form className="form" action="create-profile.html">
                    <div className="form-group">
                        <input type="text" placeholder="Name" name="name" required />
                    </div>
                    <div className="form-group">
                        <input type="email" placeholder="Email Address" name="email" />
                        <small className="form-text"
                        >This site uses Gravatar so if you want a profile image, use a
                            Gravatar email</small
                        >
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Password"
                            name="password"
                            minLength="6"
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            name="password2"
                            minLength="6"
                        />
                    </div>
                    <input type="submit" className="btn btn-primary" value="Register" />
                </form>
                <p className="my-1">
                    Already have an account? <a href="login.html">Sign In</a>
                </p>
            </section>
        </Fragment>
    )
}
