import { Link, useNavigate } from 'react-router-dom';
import axios from '../../axios'; // Import the configured Axios instance
import React, { useContext, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Field, Form, Formik } from 'formik';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/authContext';

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setUserDetails } = useContext(AuthContext);

  // Function to handle form submission
  const handleFormSubmit = async (values, actions) => {
    try {
      console.log('Submitting form with values:', values);
      const response = await axios.post('/users/login', values);

      if (response.data.success) {
        console.log('Login successful:', response.data); // Debugging line
        localStorage.setItem('_hw_userDetails', JSON.stringify(response.data.data));
        localStorage.setItem('_hw_token', response.data.data.token);
        setUserDetails(response.data.data);
        toast.success('Login Successful');

        setTimeout(() => {
          setIsAuthenticated(true);
          if (response.data.data.role.includes('admin') || response.data.data.role.includes('super-admin')) {
            navigate('/dashboard');
          } else {
            navigate('/');
          }
        }, 400);
      }
    } catch (error) {
      console.error('Error submitting form:', error); // Debugging line
      toast.error(error?.response?.data?.msg ? error?.response?.data?.msg : "Failed To Login");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div 
      className="relative flex min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)' }} // Replace with your online image URL
    >
      <div className="absolute inset-0 bg-black opacity-50 z-0"></div> {/* Overlay for better readability */}

      <div className="relative z-10 flex flex-col justify-center w-full md:w-1/3 h-screen bg-white p-6 rounded-lg shadow-lg ml-auto">
        <img
          className="mx-auto w-auto my-10"
          src="/logo.png"
          alt="login img"
        />
        <a href='/' className='font-semibold text-gray-600 flex items-center gap-3'>
          <FaArrowLeft /> Home
        </a>
        <div className="mx-auto w-full">
          <h2 className="mt-10 text-left text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Log in
          </h2>
        </div>

        <div className="mt-10 mx-auto w-full">
          <Formik
            initialValues={{
              email: "",
              password: "",
            }}
            onSubmit={async (values, actions) => {
              await handleFormSubmit(values, actions);
            }}
          >
            {(props) => (
              <Form>
                <div>
                  <label
                    id="email"
                    className="block w-full text-sm font-medium leading-6 text-gray-700"
                  >
                    Email Address
                  </label>
                  <Field
                    required
                    name="email"
                    value={props.values.email}
                    aria-labelledby="email"
                    type="email"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div className="mt-6 w-full">
                  <label
                    htmlFor="pass"
                    className="block w-full text-sm font-medium leading-6 text-gray-700"
                  >
                    Password
                  </label>
                  <div className="relative flex items-center justify-center">
                    <Field
                      required
                      name="password"
                      value={props.values.password}
                      id="pass"
                      type="password"
                      className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    />
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    type="submit"
                    role="button"
                    className="flex w-full mr-auto justify-center rounded-md bg-green-800 text-white px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
                  >
                    Sign in
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not Registered Yet?
            <Link to="/signup" className="font-semibold ml-3 leading-6 text-gray-600 hover:text-gray-500">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
