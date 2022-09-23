const yup = require('yup')

const regx = {
  image: ['image/jpeg', 'image/jpg', 'image/png'],
  password:
    /^.*((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
  mobile: /(\+088)?-?01[0-9]\d{8}/g,
  alphabet: /^[A-Z a-z]+$/,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
}

const createUserSchema = yup.object().shape({
  name: yup.string().required('Name is Required!'),
  email: yup
    .string()
    .matches(regx.email, 'Invalid Email Address!')
    .required('Email is Required!'),
  mobile: yup
    .string()
    .matches(regx.mobile, 'Invalid Mobile Number!')
    .required('Mobile Number is Required!'),
  password: yup
    .string()
    .matches(regx.password, 'Invalid Password!')
    .required('Password Is Required!'),
})

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .matches(regx.email, 'Authentication Failed')
    .required('Email is Required!'),
  password: yup
    .string()
    .matches(regx.password, 'Authentication Failed')
    .required('Password Is Required!'),
})

const updateUserSchema = yup.object().shape({
  name: yup.string().optional(),
  email: yup.string().optional().matches(regx.email, 'Invalid Email Address!'),
  mobile: yup
    .string()
    .optional()
    .matches(regx.mobile, 'Invalid Mobile Number!'),
  password: yup.string().optional().matches(regx.password, 'Invalid Password!'),
})

const proudctAddSchema = yup.object().shape({
  name: yup
    .string()
    .matches(regx.alphabet, 'Character Only')
    .min(3, 'Too Short !')
    .max(50, 'Too Long !')
    .required('Should Not Be Empty'),
  brand: yup
    .string()
    .min(3, 'Too Short !')
    .max(20, 'Too Long !')
    .required('Should Not Be Empty'),
  category: yup.string().required('Should Not Be Empty'),
  description: yup
    .string()
    .min(10, 'Too Short !')
    .max(1000, 'Too Long !')
    .required('Should Not Be Empty'),
  price: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .max(5, 'Maximum Price Limit!')
    .required('Price is Required!'),
  countInStock: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .max(5, 'Maximum Stock Limit!')
    .required('Stock is Required!'),
  images: yup.array().min(1, 'Minimum 1 Product Image Required'),
})

const addDonorSchema = yup.object().shape({
  name: yup.string().required('Name is Required!'),
  email: yup
    .string()
    .matches(regx.email, 'Invalid Email Address!')
    .required('Email is Required!'),
  mobile: yup
    .string()
    .matches(regx.mobile, 'Invalid Mobile Number!')
    .required('Mobile Number is Required!'),
  organization: yup.string().required('Organization or Self Name!'),
  amount: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be digits only!')
    .required('Donation amount is required!'),
})

const addCharitySchema = yup.object().shape({
  item: yup.string().required('Charity Item is Required!'),
  category: yup.string().required('Charity Category is Required!'),
  charityFor: yup.string().required('Charity For Field is Required!'),
  quantity: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be digits only!')
    .required('Quantity is Rquired!'),
  unit: yup.string().required('Charity Unit is Required!'),
  netPrice: yup
    .string()
    .matches(/^[0-9]+$/, 'Must be digits only!')
    .required('Net Price is Rquired!'),
  city: yup.string().required('Charity City is Requied!'),
  division: yup.string().required('Charity division is Requied!'),
})

const updateDonorSchema = yup.object().shape({
  name: yup.string().required('Name is Required!'),
  email: yup
    .string()
    .matches(regx.email, 'Invalid Email Address!')
    .required('Email is Required!'),
  mobile: yup
    .string()
    .matches(regx.mobile, 'Invalid Mobile Number!')
    .required('Mobile Number is Required!'),
  organization: yup.string().required('Organization or Self Name!'),
})

const updateCharitySchema = yup.object().shape({
  item: yup.string().required('Charity Item is Required!'),
  charityFor: yup.string(),
  unit: yup.string().required('Charity Unit is Required!'),
  city: yup.string().required('Charity City is Requied!'),
  division: yup.string().required('Charity division is Requied!'),
})

const updateShopSchema = yup.object().shape({
  floorNo: yup.string().required('Floor No is Required!'),
  shopNo: yup.string().required('Shop No is Required!'),
  size: yup.string().required('Size is Required!'),
  rentAmount: yup.string().required('Rent Amount is Required!'),
})

const addShopSchema = yup.object().shape({
  floorNo: yup.string().required('Floor No is Required!'),
  shopNo: yup.string().required('Shop No is Required!'),
  size: yup.string().required('Size is Required!'),
  rentAmount: yup.string().required('Rent Amount is Required!'),
})

const addCustomerSchema = yup.object().shape({
  name: yup.string().required('Name should not be empty!'),
  email: yup.string().required('Email should not be empty!'),
  mobile: yup.string().required('Mobile should not be empty!'),
  address: yup.string().required('Address should not be empty!'),
  tradeLicense: yup.string().optional(),
  nid: yup.string().optional(),
  securityAmount: yup.string().optional(),
  cuttRatioFromAdvance: yup.string().optional(),
})

const updateCustomerSchema = yup.object().shape({
  name: yup.string().required('Name should not be empty!'),
  email: yup.string().required('Email should not be empty!'),
  mobile: yup.string().required('Mobile should not be empty!'),
  address: yup.string().required('Address should not be empty!'),
  tradeLicense: yup.string().optional(),
  nid: yup.string().optional(),
  securityAmount: yup.string().optional(),
  cuttRatioFromAdvance: yup.string().optional(),
})

module.exports = { createUserSchema, loginSchema, updateUserSchema }
