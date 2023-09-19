// import React from 'react';
// import ReCAPTCHA from "react-google-recaptcha";

// const APIKEY = '6LeMo-gUAAAAAOriDwhCrWFcgKAZmXDNFF0wDXpx';

// class GoogleCaptcha extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = {
//       shouldReset: false
//     }
//     this.component = React.createRef()
//   }

//   static getDerivedStateFromProps(nextProps, prevState) {
//     return { shouldReset: nextProps.reset }
//   }

//   render() {
//     return (
//       <ReCAPTCHA
//         ref="recaptcha"
//         className={this.props.className}
//         sitekey={APIKEY}
//         onChange={value => this.props.onChange(value)}
//         ref={this.component}
//       />
//     )
//   }

//   componentDidUpdate() {
//     if (this.state.shouldReset) this.component.current.reset()
//   }
// }

// export default GoogleCaptcha;