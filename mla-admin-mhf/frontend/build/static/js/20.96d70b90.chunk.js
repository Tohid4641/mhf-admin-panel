(this.webpackJsonpmla=this.webpackJsonpmla||[]).push([[20],{1096:function(e,t,a){},1115:function(e,t,a){"use strict";a.r(t);var n=a(12),s=a(13),c=a(7),r=a(16),o=a(15),l=a(0),i=a.n(l),m=a(25),u=a(22),d=a(823),p=a(824),f=a(837),h=a(829),j=a(830),g=a(831),v=a(832),P=a(822),E=a(825),D=a(826),S=(a(1096),a(11)),N=a(24),b=a.n(N),C=a(27),x=a(3),y=a.n(x),w=a(872),M=(a(881),a(882),a(18)),O=a.n(M),Y=function(e){Object(r.a)(a,e);var t=Object(o.a)(a);function a(e){var s;return Object(n.a)(this,a),(s=t.call(this,e)).handleChange=function(e){s.setState({projectFilterStatusSelected:e}),s.props.updatingprojectStatusFilter(e),s.getProjectEvents(e.value)},s.getProjectEvents=function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],a=Object(c.a)(s);t||a.setState({fetchingDetails:!0}),y.a.all([S.a.getEventsProjects("Project",e)]).then((function(e){if(e[0]){var t=e[0].data,n=(t.data?t.data:[]).map((function(e,t){return{id:e._id,details:{index:t,id:e._id,eventProjectName:e.eventProjectName,eventProjectPlace:e.eventProjectPlace,eventProjectDate:e.eventProjectDate,eventProjectDescription:e.eventProjectDescription&&e.eventProjectDescription.length>250?e.eventProjectDescription.slice(0,250)+"...":e.eventProjectDescription.slice(0,250),date:b()(e.createdAt).format("Do MMM YYYY hh:mm A")}}}));a.setState({projectsList:n,projectsMain:n})}a.setState({fetchingDetails:!1})})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in project list")}))},s.getfilterProjects=function(e,t){var a=e?b()(e).format("YYYY-MM-DD"):null,n=t?b()(t).format("YYYY-MM-DD"):null,r=Object(c.a)(s);r.setState({fetchingDetails:!0}),y.a.all([S.a.getfilterEvents("Project",a,n)]).then((function(e){if(e[0]){var t=e[0].data,a=(t.data?t.data:[]).map((function(e,t){return{id:e._id,details:{index:t,id:e._id,eventProjectName:e.eventProjectName,eventProjectPlace:e.eventProjectPlace,eventProjectDate:e.eventProjectDate,eventProjectDescription:e.eventProjectDescription&&e.eventProjectDescription.length>250?e.eventProjectDescription.slice(0,250)+"...":e.eventProjectDescription.slice(0,250),date:b()(e.eventProjectDate).format("Do MMM YYYY hh:mm A")}}}));r.setState({projectsList:a,projectsMain:a})}r.setState({fetchingDetails:!1})})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in project list")}))},s.formatProject=function(e,t){return i.a.createElement(u.c,{to:s.props.match.path+"/"+e.id,className:"mlac-each"},i.a.createElement("div",{className:"mlace-head"},i.a.createElement("span",null,e.eventProjectName),i.a.createElement("span",{className:"mlacer-date"},e.date),i.a.createElement("span",{className:"mlac-status"},i.a.createElement("i",{className:"fa fa-edit mlac-edit",onClick:function(t){s.updateProjectEvents(t,e)}})),i.a.createElement("span",null,i.a.createElement("i",{className:"fa fa-trash mlac-delete",style:{cursor:"pointer"},onClick:function(t){s.toggle(t,e.id)}}))),i.a.createElement("span",{className:"mlace-content",sm:12},e.eventProjectDescription))},s.deleteEvent=function(){var e=Object(c.a)(s);e.setState({authenticating:!0,msg:!s.state.msg});var t="";s.props.location.pathname.indexOf("projects")>-1&&(t="Project"),s.setState({authenticating:!0}),y.a.all([S.a.deleteEvent(s.state.projectid,t)]).then((function(t){if(t[0]){var a=t[0].data;a.status?(e.setState({apiSuccess:"Project deleted successfully "}),setTimeout((function(){return e.setState({modal:!e.state.modal})}),1e3),e.getProjectEvents("",!0)):e.setState({apiError:a.msg})}e.setState({authenticating:!1})})).catch((function(e){console.log(e),e.message&&console.log("An error occurred in change Password")}))},s.toggle=function(e,t){e.preventDefault(),t&&s.setState({projectid:t}),s.setState({modal:!s.state.modal}),console.log(t)},s.updateProjectEvents=function(e,t){e.preventDefault(),s.props.history.push(s.props.match.path+"/update/"+t.id)},s.filterProject=function(e){var t=s.state.searchText;e&&(t=e.target.value);var a=[];a=t&&t.length>=2?s.state.projectsMain.filter((function(e){return e.details.eventProjectName.toLowerCase().indexOf(t.toLowerCase())>-1||e.details.eventProjectPlace.toLowerCase().indexOf(t.toLowerCase())>-1||e.details.date.toLowerCase().indexOf(t.toLowerCase())>-1})):s.state.projectsMain,s.setState({searchText:t,projectsList:a})},s.filterData=function(e,t){s.getfilterProjects(e,t)},s.state={msg:!0,apiSuccess:"",projectid:"",modal:!1,startDate:null,endDate:null,projects:[],projectsMain:[],searchText:"",fetchingDetails:!1,projectFilterStatusOptions:[{label:"Pending",value:"Pending"},{label:"In Progress",value:"In Progress"},{label:"Closed",value:"Closed"}],projectFilterStatusSelected:{label:"Pending",value:"Pending"}},s}return Object(s.a)(a,[{key:"componentDidMount",value:function(){var e=this.props.projectStatusFilter?this.props.projectStatusFilter:this.state.projectFilterStatusSelected;this.setState({projecttFilterStatusSelected:e}),this.getProjectEvents(e.value)}},{key:"render",value:function(){var e=this,t=this.props,a=t.projectStatusFilter,n=t.match,s=this.state,c=s.projectsList,r=s.fetchingDetails,o=s.projectFilterStatusSelected,l=a||o;return i.a.createElement("div",{className:"col-span-12 mla-projects"},i.a.createElement("div",{className:"intro-y col-span-12 xxl:col-span-9"},i.a.createElement("div",{className:"flex items-end mt-10"},i.a.createElement(u.c,{to:n.path+"/add",className:"ml-auto flex text-theme-1"},i.a.createElement(O.a,{content:"add"})))),i.a.createElement(d.a,{className:"intro-y mt-5 mb-3"},i.a.createElement(p.a,{md:8},i.a.createElement("h2",{className:"font-weight-bold ml-2"}," ",i.a.createElement(O.a,{content:"projects"})," ")),i.a.createElement(p.a,{md:4},i.a.createElement("i",{className:"fa fa-refresh mlac-refresh",onClick:function(){e.getProjectEvents(l.value)}}))),i.a.createElement(f.a,{isOpen:this.state.modal,style:{marginTop:"0px",marginLeft:"0px"}},i.a.createElement(h.a,{style:{backgroundColor:"#253c80",color:"white"},toggle:this.toggle},"Confimation"," "),i.a.createElement(j.a,null,this.state.msg&&i.a.createElement("p",null,"Are you sure you want to delete this Project"),this.state.apiSuccess&&i.a.createElement("div",{className:"errormsg"},i.a.createElement(g.a,{color:"success"},this.state.apiSuccess))),i.a.createElement(v.a,null,this.state.authenticating?i.a.createElement("i",{className:"fa fa-spin fa-refresh authentication-loading"}):i.a.createElement(P.a,{className:" btn btn-primary ",color:"danger",onClick:this.deleteEvent},i.a.createElement("span",{className:"text-white"},"Delete")))),i.a.createElement(d.a,{className:"intro-y"},i.a.createElement(p.a,{sm:!0,md:7}),i.a.createElement(p.a,{sm:!0,md:5,className:"date-filter"},i.a.createElement(w.DateRangePicker,{enableOutsideDays:!0,isOutsideRange:function(){return!1},isDayHighlighted:function(e){return e.isSame(new Date,"d")},startDate:this.state.startDate,startDateId:"your_unique_start_date_id",endDate:this.state.endDate,endDateId:"your_unique_end_date_id",onDatesChange:function(t){var a=t.startDate,n=t.endDate;e.setState({startDate:a,endDate:n}),e.filterData(a,n)},focusedInput:this.state.focusedInput,onFocusChange:function(t){return e.setState({focusedInput:t})}})),r?i.a.createElement("i",{className:"fa fa-spin fa-refresh initial_loading"}):i.a.createElement(p.a,{sm:!0,md:!0,lg:12,className:"mb-30"},i.a.createElement(E.a,{className:"card-statistics h-100"},i.a.createElement(d.a,{className:"mlac-search-container"},i.a.createElement(p.a,{xs:12,sm:12,md:6,lg:8}),i.a.createElement(p.a,{xs:12,sm:12,md:6,lg:4},i.a.createElement("input",{className:"form-control mlac-search",value:this.state.field_search_input,placeholder:"Search",onChange:this.filterProject,onKeyDown:this.filterProject,ref:function(t){e.searchInput=t}}))),i.a.createElement(D.a,null,i.a.createElement(m.BootstrapTable,{data:c,pagination:!0,striped:!0,condensed:!0},i.a.createElement(m.TableHeaderColumn,{className:"mlac-row",dataField:"details",dataFormat:this.formatProject,isKey:!0})))))))}}]),a}(i.a.Component);t.default=Object(C.b)((function(e){return{projectStatusFilter:e.auth.projectStatusFilter}}),(function(e){return{}}))(Y)}}]);
//# sourceMappingURL=20.96d70b90.chunk.js.map