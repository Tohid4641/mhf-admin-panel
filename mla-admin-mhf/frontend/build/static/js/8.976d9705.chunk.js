(this.webpackJsonpmla=this.webpackJsonpmla||[]).push([[8],{1063:function(e,t,a){},1110:function(e,t,a){"use strict";a.r(t);var l=a(12),n=a(13),s=a(7),c=a(16),m=a(15),i=a(0),r=a.n(i),o=a(22),u=a(825),p=a(823),d=a(824),f=a(822),h=a(126),g=(a(223),a(24)),E=a.n(g),b=a(27),N=a(3),v=a.n(N),S=a(134),x=(a(1063),a(11)),y=a(1064),D=a(1068),C=a.n(D),P=a(18),w=a.n(P),Y=function(e){Object(c.a)(a,e);var t=Object(m.a)(a);function a(e){var n;return Object(l.a)(this,a),(n=t.call(this,e)).getComplaintDetails=function(e){var t=Object(s.a)(n);n.setState({fetchingDetails:!0}),v.a.all([x.a.getComplaintDetails(e)]).then((function(e){if(e[0]){var a=e[0].data;if(a.status){var l=a.data,n=l.logs,s={label:l.complaintStatus,value:l.complaintStatus};t.setState({complaitDetails:l,complaintDetailsLogs:n,complaintStatus:s,complaintHasDetails:!0}),t.setState({Success_msg:""})}else t.setState({apiError:a})}t.setState({fetchingDetails:!1})})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in complaint Details")}))},n.handleChange=function(e){n.setState({complaintStatus:e}),n.updateComplaintStatus(e.value)},n.updateComplaintStatus=function(e){var t=Object(s.a)(n);n.setState({updatingStatus:!0}),v.a.all([x.a.updateComplaintStatus(n.props.match.params.complaint_id,e)]).then((function(e){if(e[0]){var a=e[0].data;if(a.status){var l=a.data;console.log(l)}else t.setState({apiError:a})}t.setState({updatingStatus:!1})})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in change Password")}))},n.updateComplaintPublish=function(e){var t=Object(s.a)(n);n.setState({publishStatus:!0}),v.a.all([x.a.updateComplaintPublish(n.props.match.params.complaint_id,e)]).then((function(e){if(e[0]){var a=e[0].data;if(a.status){var l=a.data;console.log(l),t.getComplaintDetails(t.props.match.params.complaint_id)}else t.setState({apiError:a})}t.setState({publishStatus:!1})})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in change Password")}))},n.updateComplaintPublish=n.updateComplaintPublish.bind(Object(s.a)(n)),n.state={complaitDetails:{},complaintDetailsLogs:[],complaintStatus:"",complaintStatusOptions:[{label:r.a.createElement(w.a,{content:"pending"}),value:"Pending"},{label:r.a.createElement(w.a,{content:"in progress"}),value:"In Progress"},{label:r.a.createElement(w.a,{content:"closed"}),value:"Closed"}],fetchingDetails:!1,complaintHasDetails:!1,updatingStatus:!1,publishStatus:!1},n}return Object(n.a)(a,[{key:"componentDidMount",value:function(){this.getComplaintDetails(this.props.match.params.complaint_id)}},{key:"render",value:function(){var e=this,t=this.state,a=t.complaitDetails,l=t.complaintDetailsLogs,n=t.fetchingDetails,s=t.complaintStatus,c=t.complaintStatusOptions,m=t.complaintHasDetails,g=t.updatingStatus,b=t.publishStatus,N=this.props.config;return r.a.createElement("div",{className:"col-span-12 mla-complaints-details"},a&&a.complaintNumber&&r.a.createElement(u.a,{className:"intro-y alignment complaint-status-card"},r.a.createElement(p.a,{className:"container mt-3"},r.a.createElement(d.a,{sm:12,md:6,lg:6},r.a.createElement("span",{className:"br"}),r.a.createElement("p",{className:"font-weight-bold"},a.complaintNumber),r.a.createElement("p",{className:"secondary mt-1"},r.a.createElement(w.a,{content:"Complaint Number"}))),r.a.createElement(d.a,{sm:12,md:6,lg:6},r.a.createElement("p",{className:"font-weight-bold"},E()(a.createdAt).format("Do MMM YYYY hh:mm A")),r.a.createElement("p",{className:"secondary mt-1"}," ",r.a.createElement(w.a,{content:"created date"}))),r.a.createElement(d.a,{sm:12,md:6,lg:6},r.a.createElement("span",{className:"br"}),r.a.createElement("p",{className:"font-weight-bold"},a&&a.user&&a.user.fullName&&a.user.fullName,a&&a.user&&a.user.mobileNo&&r.a.createElement("span",null," - ",a.user.mobileNo," ")),r.a.createElement("p",{className:"secondary mt-1"},r.a.createElement(w.a,{content:"ticket raised by"}))),r.a.createElement(d.a,{sm:12,md:6,lg:6},r.a.createElement("p",{className:"text-warning font-weight-bold"},a.complaintStatus,"Closed"!==a.complaintStatus&&r.a.createElement(i.Fragment,null," - "," ",E()(new Date).diff(E()(a.createdAt),"days")," "," Days")),r.a.createElement("p",{className:"secondary mt-1"},r.a.createElement(w.a,{content:"status"}))))),n?r.a.createElement("i",{className:"fa fa-spin fa-refresh initial_loading"}):m?r.a.createElement("div",{className:"intro-y news p-5 box mt-2"},r.a.createElement(p.a,null,r.a.createElement(d.a,{xs:12,sm:12,md:6,lg:8},r.a.createElement("h2",{className:"intro-y font-medium text-xl sm:text-2xl"},a.complaintTitle),r.a.createElement("div",{className:"intro-y text-gray-700 text-xs sm:text-sm"},E()(a.createdAt).format("Do MMM YYYY hh:mm A"),r.a.createElement("span",{className:"mx-1"},"\u2022"),a.complaintLocation)),r.a.createElement(d.a,{xs:12,sm:12,md:6,lg:4,className:"mlac-change-statue"},r.a.createElement(S.a,{name:"mlac-status-change",className:"selectbox w-full  mt-2 flex-1",onChange:this.handleChange,options:c,value:s,isSearchable:!0,style:{border:"none !important"},isLoading:g+b,isDisabled:g+b}),a.complaintPublish&&"Publish"===a.complaintPublish?r.a.createElement(f.a,{style:{float:"right"},className:" btn btn-primary mt-3",color:"primary",onClick:function(){e.updateComplaintPublish("")}},r.a.createElement(w.a,{content:"unpublish"})):r.a.createElement(f.a,{style:{float:"right"},className:" btn btn-primary mt-3",color:"primary",onClick:function(){e.updateComplaintPublish("Publish")}},r.a.createElement(w.a,{content:"publish"})))),r.a.createElement("div",{className:"intro-y text-justify leading-relaxed mt-5"},r.a.createElement("p",{className:"mb-5"},a.complaintDescription)),r.a.createElement("br",null),a.complaintFileNames&&""!==a.complaintFileNames&&r.a.createElement(h.Carousel,null,r.a.createElement("div",null,r.a.createElement("img",{src:N.fileBasicPath+a.complaintFileNames,alt:"description"}))),r.a.createElement("div",{className:"intro-y flex text-xs sm:text-sm flex-col sm:flex-column items-center border-t border-gray-200"},r.a.createElement("span",{className:"malac-by"},r.a.createElement(w.a,{content:"complaint by"}),":"," "),r.a.createElement("div",{className:"flex items-center"},r.a.createElement("div",{className:"w-12 h-12 flex-none image-fit"},a&&a.user&&a.user.userPhoto&&""!==a.user.userPhoto?r.a.createElement("img",{alt:" ",className:"rounded-full",src:N.fileBasicPath+a.user.userPhoto}):r.a.createElement("img",{alt:" ",className:"rounded-full",src:"images/profile-10.jpg"})),r.a.createElement("div",{className:"ml-3 mr-auto text-gray-600"},r.a.createElement(o.b,{className:"font-medium text-black"},a&&a.user&&a.user.fullName&&a.user.fullName),r.a.createElement("span",{className:"mx-1"},"\u2022"),r.a.createElement(o.b,{className:"font-medium text-black"},a&&a.user&&a.user.mobileNo&&a.user.mobileNo))),r.a.createElement("div",{className:"flex items-center text-gray-700 sm:ml-auto mt-5 sm:mt-0"},r.a.createElement("div",{className:"intro-y flex relative pt-16 sm:pt-6 items-center pb-6"})))):r.a.createElement("div",null,"No Record Found"),r.a.createElement("br",null),r.a.createElement("hr",null),r.a.createElement("div",{className:"complaint_status_track mt-3"},l.reverse().map((function(e){return r.a.createElement(y.Timeline,null,r.a.createElement(y.TimelineEvent,{title:e.complaintId,createdAt:E()(e.createdAt).format("Do MMM YYYY hh:mm A"),icon:r.a.createElement(C.a,{icon:"person"})},e.complaintStatus))}))))}}]),a}(r.a.Component);t.default=Object(b.b)((function(e){return{config:e.auth.config}}),(function(e){return{}}))(Y)}}]);
//# sourceMappingURL=8.976d9705.chunk.js.map