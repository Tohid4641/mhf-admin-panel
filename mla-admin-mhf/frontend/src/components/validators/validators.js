const validator = {
  fullName: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Please enter a Full Name",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  name: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  whatKindOfHospital: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  timingsOfHospital: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  about: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  designation: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  specialisation: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  hospitalName: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  fatherSpouseName: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Please enter a Father/Spouse Name",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  date: {
    rules: [
      {
        test: (value) => {
          return value !== null;
        },
        message: "Please enter Date Of Birth",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  adhaar: {
    rules: [
      {
        test: (value) => {
          return value && value.length == 12;
        },
        message: "Please enter Aadhaar",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  departmentName: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 2;
        },
        message: "Department Name  is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  addUrl: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " URL  is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },

  album_title: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Title Name  is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  event_title: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Title Name  is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  event_subtitle: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Subtitle Name  is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  event_location: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Location   is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  event_description: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Description   is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  qualification: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "   Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  address: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "Please enter a Flat Number & Address",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  area: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "Please enter a Area",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  reference: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "Please enter a Reference Name",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  city: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "Please enter a city",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  state: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "Please enter a state",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  zipCode: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 5;
        },
        message: "Please enter a Zip Code",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  file: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "  Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  profile_name: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  mobile_no: {
    rules: [
      {
        test: /^[0-9]{10}$/,
        message: "Phone Number must be 10 digits",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },

  facebook_link: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Facebook Link Is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },

  twitter_link: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: "Twitter Link Is Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  firstName: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  lastName: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  role: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  email: {
    rules: [
      {
        test: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/i,
        message: "Please enter email",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  otp: {
    rules: [
      {
        test: (value) => {
          return value && value.length >= 4;
        },
        message: "Enter Valid OTP",
      },
      {
        test: /^[a-z0-9A-Z_]+$/,
        message: "Enter Valid OTP",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  complaintNumber: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Enter  Complaint Number",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  contact: {
    rules: [
      {
        test: (value) => {
          return value && value.length > 1;
        },
        message: " Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
  termsAndCondition: {
    rules: [
      {
        test: (value) => {
          return value;
        },
        message: "Required",
      },
    ],
    errors: [],
    valid: false,
    state: "",
  },
};

export default validator;
