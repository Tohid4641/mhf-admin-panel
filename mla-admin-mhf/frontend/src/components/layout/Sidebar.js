import React, { Component, Fragment } from "react";
import { NavLink, Link } from "react-router-dom";
import Translate from "react-translate-component";
import Logo from "../images/main/logo.svg";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileMenuActive: false,
    };
  }

  toggleMobileMenu = () => {
    this.setState({ mobileMenuActive: !this.state.mobileMenuActive });
  };

  render() {
    const { mobileMenuActive } = this.state;

    return (
      <Fragment>
        <div class="mobile-menu md:hidden">
          <div class="mobile-menu-bar">
            <Link to="/" class="flex mr-auto">
              <img alt="logo" class="w-6" src={Logo} />
            </Link>
            <div
              id="mobile-menu-toggler"
              className="menu-ion"
              onClick={this.toggleMobileMenu}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-bar-chart-2 w-8 h-8 text-white transform -rotate-90"
              >
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
          </div>
          <ul className={`${mobileMenuActive ? "active" : ""}`}>
            <li>
              <NavLink
                to={"/home"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i class="fa fa-home fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="menu__title">
                  {" "}
                  <Translate content="dashboard" />{" "}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/membership"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i class="fa fa-users fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="menu__title"> Membership</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/events"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i class="fa fa-calendar-o fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="menu__title"> Activities</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/hospitals-facilities"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i class="fa fa-hospital-o fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="menu__title"> Hospitals & Facilities</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/doctors"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i class="fa fa-user-md fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="menu__title"> Doctors & Timings</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/about-us"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i
                    class="fa fa-address-card fa-lg"
                    aria-hidden="true"
                  ></i>{" "}
                </div>
                <div className="menu__title"> About Us</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/join-us"}
                className="menu"
                activeClassName="menu--active"
              >
                <div className="menu__icon">
                  {" "}
                  <i
                    class="fa fa-handshake-o fa-lg"
                    aria-hidden="true"
                  ></i>{" "}
                </div>
                <div className="menu__title"> Join Us or Donate</div>
              </NavLink>
            </li>

            {/* <li>
              <NavLink
                to={'/complaints'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-cube fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='complaints' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/departments'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-building-o fa-lg' aria-hidden='true'></i>
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='departments' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/events'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-calendar-o fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='events' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/projects'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-tasks fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='projects' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/albums'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i
                    class='fa fa-file-image-o fa-lg'
                    aria-hidden='true'
                  ></i>{' '}
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='albums' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/profile'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-user fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='mlaprofile' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/users'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-user-o fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  {' '}
                  <Translate content='users' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/serviceheads'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-life-ring fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  <Translate content='serviceHeads' />
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/contacts'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i
                    class='fa fa-address-card fa-lg'
                    aria-hidden='true'
                  ></i>{' '}
                </div>
                <div className='menu__title'>
                  <Translate content='contact' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/contactUs'}
                className='menu'
                activeClassName='menu--active'
              >
                <div className='menu__icon'>
                  {' '}
                  <i class='fa fa-phone fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='menu__title'>
                  <Translate content='contactUs' />{' '}
                </div>
              </NavLink>
            </li> */}
          </ul>
        </div>
        <nav className="side-nav">
          <Link to={"/home"} className="intro-x flex items-center pl-5 pt-4">
            <img alt="MHF" className="w-6" src={Logo} />
            <span className="hidden xl:block text-white text-lg ml-3">
              {" "}
              <b>MHF</b>{" "}
            </span>
          </Link>
          <div className="side-nav__devider my-6"></div>
          <ul>
            <li>
              <NavLink
                to={"/home"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  <i class="fa fa-home fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="side-menu__title">
                  {" "}
                  <Translate content="dashboard" />{" "}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/profile"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  <i class="fa fa-user fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="side-menu__title">
                  {" "}
                  <Translate content="profile" />{" "}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/membership"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i class="fa fa-users fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="side-menu__title">Membership</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/by-expiry"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i class="fa fa-repeat" aria-hidden="true"></i>{" "}
                </div>
                <div className="side-menu__title">By Expiry</div>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to={"/renewal-request"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i class="fa fa-recycle" aria-hidden="true"></i>
                </div>
                <div className="side-menu__title">Renewal Request</div>
              </NavLink>
            </li> */}
            <li>
              <NavLink
                to={"/events"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i class="fa fa-calendar-o fa-lg" aria-hidden="true"></i>
                </div>
                <div className="side-menu__title"> Activities</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/hospitals-facilities"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i class="fa fa-hospital-o fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="side-menu__title">Hospitals & Facilities</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/doctors"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i class="fa fa-user-md fa-lg" aria-hidden="true"></i>{" "}
                </div>
                <div className="side-menu__title">Doctors & Timings</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/about-us"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i
                    class="fa fa-address-card fa-lg"
                    aria-hidden="true"
                  ></i>{" "}
                </div>
                <div className="side-menu__title">About Us</div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={"/join-us"}
                className="side-menu"
                activeClassName="side-menu--active"
              >
                <div className="side-menu__icon">
                  {" "}
                  <i
                    class="fa fa-handshake-o fa-lg"
                    aria-hidden="true"
                  ></i>{" "}
                </div>
                <div className="side-menu__title">Join Us or Donate</div>
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to={'/complaints'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-cube fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  {' '}
                  <Translate content='complaints' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/departments'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-building-o fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  <Translate content='departments' />
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/events'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-calendar-o fa-lg' aria-hidden='true'></i>
                </div>
                <div className='side-menu__title'>
                  {' '}
                  <Translate content='events' />{' '}
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink
                to={'/projects'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-tasks fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  {' '}
                  <Translate content='projects' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/albums'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-file-image-o fa-lg' aria-hidden='true'></i>
                </div>
                <div className='side-menu__title'>
                  {' '}
                  <Translate content='albums' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/profile'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-user fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  {' '}
                  <Translate content='mlaprofile' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/users'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-user-o fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  {' '}
                  <Translate content='users' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/serviceheads'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-life-ring fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  <Translate content='serviceHeads' />
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/contacts'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i
                    class='fa fa-address-card fa-lg'
                    aria-hidden='true'
                  ></i>{' '}
                </div>
                <div className='side-menu__title'>
                  <Translate content='contact' />{' '}
                </div>
              </NavLink>
            </li>

            <li>
              <NavLink
                to={'/contactUs'}
                className='side-menu'
                activeClassName='side-menu--active'
              >
                <div className='side-menu__icon'>
                  {' '}
                  <i class='fa fa-phone fa-lg' aria-hidden='true'></i>{' '}
                </div>
                <div className='side-menu__title'>
                  <Translate content='contactUs' />{' '}
                </div>
              </NavLink>
            </li> */}

            {/*
                        {/* <li>
                        <NavLink to={"/gallery"} className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                                strokeLinecap="round" strokeLinejoin="round" className="feather feather-trello">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <rect x="7" y="7" width="3" height="9"></rect>
                                <rect x="14" y="7" width="3" height="5"></rect>
                            </svg> </div>
                            <div className="side-menu__title"> Gallery </div>
                        </NavLink>

                    </li> 
            <li>
                        <NavLink to={"/settings"} className="side-menu" activeClassName="side-menu--active">
                            <div className="side-menu__icon"> <i class="fa fa-cog fa-lg" aria-hidden="true"></i> </div>
                            <div className="side-menu__title">
                               Settings
                                 </div>
                        </NavLink>
                    </li> */}
          </ul>
        </nav>
      </Fragment>
    );
  }
}
export default Sidebar;
