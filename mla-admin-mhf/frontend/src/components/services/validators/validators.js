const validator = {
  email: {
    rules: [
      {
        test: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i,
        message: 'Please Enter Valid Email'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  password: {
    rules: [
      {
        test: value => {
          return value.length >= 4
        },
        message: 'Password must not be shorter than 4 characters'
      },
      {
        test: /^[a-z0-9A-Z_]+$/,
        message: 'Enter Valid Password'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  firstname: {
    rules: [
      {
        test: /^[a-zA-Z_]+$/i,
        message: 'number not allowed'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  lastname: {
    rules: [
      {
        test: /^[a-zA-Z_]+$/i,
        message: 'number not allowed'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  username: {
    rules: [
      {
        test: value => {
          return value.length > 1
        },
        message: 'Username should not be empty'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  otp: {
    rules: [
      {
        test: value => {
          return value.length >= 4
        },
        message: 'Enter Valid OTP'
      },
      {
        test: /^[a-z0-9A-Z_]+$/,
        message: 'Enter Valid OTP'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  },
  complaintNumber: {
    rules: [
      {
        test: value => {
          return value.length >= 4
        },
        message: 'Enter Valid Complaint Number'
      },
      {
        test: /^[a-z0-9A-Z_]+$/,
        message: 'Enter Valid Complaint Number'
      }
    ],
    errors: [],
    valid: false,
    state: ''
  }
}

export default validator
