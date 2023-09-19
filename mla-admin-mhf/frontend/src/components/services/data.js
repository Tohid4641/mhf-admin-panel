import profileImg1 from '../images/profile-3.jpg'
import profileImg2 from '../images/profile-8.jpg'
import adhaar from '../images/aadhar.jpg'
import electionCard from '../images/election.jpg'
let data = [
  {
    id: '1',
    profileImg: profileImg1,
    profileImgName: 'profile-3.jpg',
    fullName: 'Test User 1',
    fatherSpouseName: 'Test',
    email: 'testuser@gmail.com',
    date: '2021-01-29T06:40:37.000Z',
    // date:new Date('2021-01-29T06:40:37.000Z'),
    adhaar: '213123213123',
    adhaarUpload: adhaar,
    election: '34234232332',
    electionUpload: electionCard,
    maritalStatus: 'single',
    gender: 'male',
    mobile_no: '9876545654',
    address: 'Dhsksl Tolichowki Hyderabad Telangana - 500005',
    area: 'Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500009',
    educational: 'post graduate',
    familyMembers: [
      { fullName: 'Test', relation: 'Test', idNumber: '12312312' },
      { fullName: 'Test 1', relation: 'Test 1', idNumber: '43343333' }
    ],
    planTypeName: 'Six Month Plan',
    cardID: 'MHF102023322332',
    status: 'Approve'
  },
  {
    id: '2',
    profileImg: profileImg2,
    profileImgName: 'profile-8.jpg',
    fullName: 'Dr.  Wilson',
    fatherSpouseName: 'Test',
    email: 'testuser@gmail.com',
    date: '2021-01-29T06:40:37.000Z',
    // date:new Date('2021-01-29T06:40:37.000Z'),
    adhaar: '213123213123',
    adhaarUpload: adhaar,
    election: '34234232332',
    electionUpload: electionCard,
    maritalStatus: 'married',
    gender: 'male',
    mobile_no: '9876545654',
    address: '  Tolichowki Hyderabad Telangana - 500008',
    area: 'Hyderabad',
    city: 'Hyderabad',
    state: 'Telangana',
    zipCode: '500009',
    educational: 'under graduate',
    familyMembers: [
      { fullName: 'Test', relation: 'Test', idNumber: '12312312' }
    ],
    planTypeName: 'One Year Plan',
    cardID: 'MHF102023322434',
    status: 'Pending'
  }
]

export default data
