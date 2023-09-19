import React from "react";
import { NavLink } from "react-router-dom";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { connect } from "react-redux";
import Pagination from "react-js-pagination";
import { Row, Col, Card, CardBody } from "reactstrap";
import { DebounceInput } from "react-debounce-input";

import adminService from "../../services/adminService";
import axios from "axios";
import moment from "moment";
import "./Renewal.scss";
import PageLoading from "../../elements/pageLoading/pageLoading";

class Renewal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      membersList: [],
      fetchingDetails: false,
      msg: true,
      apiSuccess: "",
      modal: false,
      memberId: "",
      authenticating: false,
      selectedStatus: { label: "Approved", value: "Approved" },
      skip: 0,
      limit: 30,
      pages: {},
      membersCount: 0,
      activePage: 0,
      searchTerm: "",
      exporting: false,
    };

    this.membersToken = null;
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    this.usersListByMembershipStatus("Approved");
  }

  usersListByMembershipStatus = (status, skip = 0, searchTerm = "") => {
    var thisView = this;
    thisView.setState({ fetchingDetails: true });
    const details = {
      skip,
      limit: this.state.limit,
    };

    if (searchTerm && searchTerm != "") {
      details.search = searchTerm;
    }

    if (this.membersToken) this.membersToken.cancel();
    this.membersToken = axios.CancelToken.source();

    axios
      .all([
        adminService.usersListByMembershipExpiryDate(
          this.membersToken.token,
          details
        ),
      ])
      .then(function (res) {
        if (res[0]) {
          let resData = res[0].data;
          if (resData.status) {
            let membersData = resData.data ? resData.data : [];
            let membersCount = membersData.membersCount
              ? membersData.membersCount
              : 0;
            let membersList = membersData.members ? membersData.members : [];
            membersList = membersList.map((eachMember, index) => {
              return {
                ...eachMember,
                id: eachMember._id,
                sNo: skip + index + 1,
                statusMember: "Pending",
              };
            });
            let activePage = 0;
            if (membersCount !== 0 && skip !== 0) {
              activePage = parseInt(skip / thisView.state.limit);
            }

            let pages = thisView.state.pages;
            pages["page_" + activePage] = membersList;
            thisView.setState({ membersList, membersCount, pages, activePage });

            thisView.setState({ Success_msg: "" });
          } else {
            thisView.setState({ apiError: resData });
          }
        }
        thisView.setState({ fetchingDetails: false });
      })
      .catch(function (res) {
        console.log(res);
        if (res.message) console.log("An error occurred in change Password");
      });
  };
  renewPlan = (cell, row) => {
    return (
      <div className="mlace-head">
        <NavLink
          className="review-btn btn"
          to={this.props.match.path + "/renew/" + row.id}
        >
          Renew
        </NavLink>
      </div>
    );
  };
  uploadFormatter = (cell, row) => {
    return (
      <div className="mlace-head">
        {row.email && (
          <>
            {/* <span
              className={`member-status mr-2 ${
                row.memberShipStatus ? row.memberShipStatus.toLowerCase() : ""
              }`}
            >
              {row.memberShipStatus}
            </span> */}
            <NavLink
              className="review-btn mr-3 btn"
              to={this.props.match.path + "/" + row._id}
            >
              Details
            </NavLink>
          </>
        )}
      </div>
    );
  };

  formateCreatedOn = (cell, row) => {
    return (
      <div className="mlace-head">
        {row.createdAt && (
          <span>
            {moment(new Date()).diff(moment(row.createdAt), "days") === 0
              ? "Today"
              : moment(new Date()).diff(moment(row.createdAt), "days") === 1
              ? moment(new Date()).diff(moment(row.createdAt), "day") + " Day"
              : moment(new Date()).diff(moment(row.createdAt), "day") + " Days"}
          </span>
        )}
      </div>
    );
  };
  formateExpiredOn = (cell, row) => {
    return (
      <div className="mlace-head">
        {row.expiryDate && (
          <span>
            {moment(moment(row.expiryDate)).diff(new Date(), "days") === 0
              ? "Today"
              : moment(moment(row.expiryDate)).diff(new Date(), "days") === 1
              ? moment(moment(row.expiryDate)).diff(new Date(), "day") + " Day"
              : moment(moment(row.expiryDate)).diff(new Date(), "day") +
                " Days"}
          </span>
        )}
      </div>
    );
  };

  updateContact = (row, cell) => {
    return (
      <NavLink to={this.props.match.path + "/update/" + row.id}>{cell}</NavLink>
    );
  };

  formatName = (cell, row) => {
    return (
      <NavLink to={this.props.match.path + "/card/" + row._id}>{cell}</NavLink>
    );
  };
  displayDate = (cell, row) => {
    return <p>{cell ? moment(cell).format("DD/MM/YYYY") : ""}</p>;
  };
  toggle(id) {
    if (id) {
      this.setState({ memberId: id });
    }
    this.setState({
      modal: !this.state.modal,
    });
  }
  onStatusSelected = (selectedStatus) => {
    this.setState(
      {
        selectedStatus,
        skip: 0,
      },
      () => {
        this.usersListByMembershipStatus(
          selectedStatus.value,
          0,
          this.state.searchTerm
        );
      }
    );
  };

  paginationClicked = (page) => {
    console.log(page);
    if (this.state.pages && this.state.pages["page_" + (page - 1)]) {
      console.log(this.state.pages);
      this.setState({
        membersList: this.state.pages["page_" + (page - 1)],
        activePage: page - 1,
      });
    } else {
      this.setState({ skip: this.state.limit * (page - 1) });
      this.usersListByMembershipStatus(
        this.state.selectedStatus.value,
        this.state.limit * (page - 1),
        this.state.searchTerm
      );
    }
  };

  searchMember = (searchTerm) => {
    console.log(searchTerm);
    this.setState({ skip: 0, searchTerm }, () => {
      this.usersListByMembershipStatus(
        this.state.selectedStatus.value,
        0,
        searchTerm
      );
    });
  };

  render() {
    const { match } = this.props;
    const { fetchingDetails, membersList } = this.state;

    return (
      <div className="col-span-12 membership">
        <div className="intro-y col-span-12">
          <div className="intro-y flex items-end mt-10 mb-10">
            <h2 className="text-lg text-black font-medium">
              Expired MemberShip
            </h2>
            <div className="membership-search-box">
              <DebounceInput
                placeholder="Search"
                minLength={3}
                debounceTimeout={300}
                onChange={(event) => {
                  this.searchMember(event.target.value);
                }}
              />
            </div>
          </div>
          {/* main body */}
          <Row className={"intro-y"}>
            {
              // !fetchingDetails &&
              <>
                <Col sm md lg={12} className="mb-30">
                  <Card className="card-statistics h-100">
                    <CardBody>
                      <BootstrapTable
                        data={membersList}
                        // pagination
                        striped
                        condensed
                        // search
                      >
                        <TableHeaderColumn width="40" dataField="sNo" isKey>
                          {" "}
                          SNo
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width="100"
                          dataField="name"
                          dataFormat={this.formatName}
                        >
                          {" "}
                          Name
                        </TableHeaderColumn>
                        <TableHeaderColumn width="120" dataField="email">
                          {" "}
                          Email
                        </TableHeaderColumn>
                        <TableHeaderColumn width="100" dataField="mobileNo">
                          {" "}
                          Mobile Number
                        </TableHeaderColumn>
                        <TableHeaderColumn width="80" dataField="maritalStatus">
                          {" "}
                          Marital Status
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width="100"
                          dataField="createdAt"
                          dataFormat={this.displayDate}
                        >
                          {" "}
                          Created At
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width="120"
                          dataField="expiryDate"
                          dataFormat={this.displayDate}
                        >
                          Expiry Date
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width="120"
                          dataFormat={this.formateExpiredOn}
                        >
                          Expired On
                        </TableHeaderColumn>
                        <TableHeaderColumn
                          width="120"
                          dataFormat={this.uploadFormatter}
                        >
                          Actions
                        </TableHeaderColumn>
                      </BootstrapTable>
                    </CardBody>
                  </Card>
                </Col>
                <Pagination
                  activePage={this.state.activePage + 1}
                  itemsCountPerPage={this.state.limit}
                  totalItemsCount={this.state.membersCount}
                  pageRangeDisplayed={10}
                  itemClass="page-item"
                  linkClass="page-link"
                  onChange={this.paginationClicked}
                  firstPageText={"First"}
                  prevPageText={"Prev"}
                  nextPageText={"Next"}
                  lastPageText={"Last"}
                />
              </>
            }
            {fetchingDetails && <PageLoading />}
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  config: state.auth.config,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Renewal);
