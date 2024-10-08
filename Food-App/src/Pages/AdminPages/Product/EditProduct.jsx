import axios from '../../../axios'
import { Field, FieldArray, Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import Modal from 'react-modal'
import Swal from 'sweetalert2'
import { object } from 'yup'

function EditProduct({ modalIsOpen, closeModal, getRoute, productData }) {

  const [categoryList, setCategoryList] = useState()
  const [imageList, setImageList] = useState([])
  const [prevImageList, setPrevImageList] = useState(productData.images)

  const getAllCategory = async () => {
    try {
      let result = await axios.get('/category')

      if (result.data.success) {
        setCategoryList(result.data.data)
      } else toast.error('Failed')
    } catch (ERR) {
      console.log(ERR)
      toast.error(ERR.response.data.msg)
    }
  }

  useEffect(() => {
    getAllCategory()
  }, [])

  // const imageData = new FormData

  const handleImages = (files) => {
    setImageList([
      ...files
    ])

   
  }

  const handleSubmit = async (values, actions) => {
    try {

      let formData = new FormData

      for (let value in values) {
        if (typeof values[value] === "object") {
          formData.append(value, JSON.stringify(values[value]))
        } else formData.append(value, values[value])
      }

      for (let image in imageList) {
        formData.append('images', imageList[image])
      }

      
      let result = await axios.put('/products/' + productData._id, formData)

      if (result.data.success) {
        toast.success('Product Edited Successfully')
        closeModal()
        getRoute()
      } else toast.error('Failed')
    } catch (ERR) {
      console.log(ERR)
      toast.error(ERR.response.data.msg)
    }
  }

  const removeItem = async (path) => {
    try {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, Delete it!'
      }).then(async (result) => {
        if (result.isConfirmed) {
          let result = await axios.put('products/' + productData?._id, {
            replace_images_paths: [path]
          })
          if (result.data.success) {
            console.log('', result.data.data)
            setPrevImageList(result?.data?.data?.images)
            getRoute()
            toast.success('Deleted Successfully')
          }
        }
      })

    } catch (ERR) {
      console.log(ERR)
      toast.error(ERR.response.data.msg)
    }
  }

  return (
    <Modal
      ariaHideApp={false}
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Edit Product Modal"
      overlayClassName="Overlay"
      className="Modal rounded-md p-5 md:w-2/4 max-h-screen overflow-auto"
    >
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">Edit Product</h1>

      <div className='mt-4'>
        {/* [{"sku": "lg-red","calorie_count": 10,"variant_type": [{"size": "lg","color": "red"}],"price": 100}] */}
        <Formik
          initialValues={{
            name: productData.name,
            category: productData.category._id,
            description: productData.description,
            calorie_count: productData.calorie_count,
            price: productData.price,
            
          }}
          onSubmit={async (values, actions) => {
            handleSubmit(values, actions);
          }}
        >
          {(props) => (
            <Form>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <label
                    id="name"
                    className="block w-full text-sm font-medium leading-6 text-gray-900"
                  >
                    Name
                  </label>
                  <Field
                    required
                    name="name"
                    value={props.values.name}
                    aria-labelledby="name"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  />
                </div>

                {console.log(props.values)}
                <div>
                  <label
                    id="category"
                    className="block w-full text-sm font-medium leading-6 text-gray-900"
                  >
                    Category
                  </label>
                  <Field
                    required
                    as="select"
                    name="category"
                    value={props.values.category}
                    aria-labelledby="category"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  >
                    <option value={""}>Select Category</option>
                    {
                      categoryList && categoryList.map((value, index) => (
                        <option className='' value={value._id} key={index}>{value.name}</option>
                      ))
                    }
                  </Field>
                </div>


                <div className='col-span-full'>
                  <label
                    id="description"
                    className="block w-full text-sm font-medium leading-6 text-gray-900"
                  >
                    Description
                  </label>
                  <Field
                    as="textarea"
                    required
                    name="description"
                    value={props.values.description}
                    aria-labelledby="description"
                    type="description"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                  <label
                    id="calorie_count"
                    className="block w-full text-sm font-medium leading-6 text-gray-900"
                  >
                    Calorie Count
                  </label>
                  <Field
                    type="number"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    name={`calorie_count`} />

                </div>
                <div>
                  <label
                    id="price"
                    className="block w-full text-sm font-medium leading-6 text-gray-900"
                  >
                    Price
                  </label>
                  <Field
                    min={10}
                    type="number"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                    name={`price`} />

                </div>
                
                <div>
                  <label
                    id="images"
                    className="block w-full text-sm font-medium leading-6 text-gray-900"
                  >
                    Images
                  </label>
                  <input
                    onChange={(e) => {
                      handleImages(e.target.files)
                    }}
                    accept="image/*"
                    multiple
                    type="file"
                    className="block mt-2 w-full rounded-md border-0 py-1.5 px-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-600 sm:text-sm sm:leading-6"
                  />

                  <div className='flex gap-2 items-center mt-3'>
                    {
                      prevImageList?.map((value, index) => (
                        <div className='relative'>
                          <button type='button' onClick={() => {
                            removeItem(value)
                          }} className='absolute bottom-0 bg-red-600 w-full text-white text-xs'>Remove</button>
                          <img src={`${import.meta.env.VITE_APP_BASE_URI}${value}`} key={index} alt="prod_img" className='h-24 w-24 object-contain border shadow' />
                        </div>
                      ))
                    }

                  </div>
                </div>


                
              </div>

              <div className="mt-8 flex gap-4">
                <button
                  type="submit"
                  role="button"
                  className="flex w-full justify-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                >
                  Edit
                </button>
                <button
                  onClick={closeModal}
                  type="submit"
                  role="button"
                  className="flex w-full justify-center rounded-md bg-red-200 px-3 py-1.5 text-sm font-semibold leading-6 text-red-800 shadow-sm hover:bg-red-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Close
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

    </Modal>
  )
}

export default EditProduct