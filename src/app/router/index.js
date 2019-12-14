import React from 'react';
// import { withRouter } from 'react-router';
import { Switch, Route, withRouter } from 'react-router-dom';
import { Layout, Menu, Icon } from 'antd';
import HomePage from '../containers/HomePage';
import Editor from '../components/Editor';
import Story from '../components/Story';
import Header from '../components/Header';
import NoAccess from '../components/NoAccess';
import CropImage from '../components/CropImage';
import Admin from '../containers/Admin';
import Profile from '../containers/Profile';
import SignIn from '../containers/Signup';
import Login from '../containers/Login';
import StoryListing from '../containers/StoryListing';
import Loader from '../components/Loader';
import Firebase from '../utils/firebase';
import './index.scss';

import Test from '../components/Editor/test';

const adminPath = ['/profile', '/editor', '/admin'];
const headerPath = adminPath;
const { Content } = Layout;

class AppRouter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loggedIn: false,
			noAccess: false,
			showLoader: true,
			isEditor: false
		}
	}

	componentWillMount() {
		this.setState({ showLoader: true }, () => {
			this.isLoggedIn();
		})
	}

	componentWillReceiveProps() {
		this.isLoggedIn();
	}

	restrictAccess = () => {
		let url = this.props.location.pathname;
		this.setState({ noAccess: adminPath.includes(url), showLoader: false, showHeader: headerPath.includes(url) });
	}

	isLoggedIn = () => {
		let url = this.props.location.pathname;
		let firebase = Firebase.getInstance();
		let reactState = this;
		firebase.getAuth().checkStatus(function (user) {
			if (user) {
				reactState.setState({ showLoader: false, loggedIn: true, showHeader: headerPath.includes(url) });
			}
			else {
				reactState.setState({ showLoader: false, loggedIn: false });
				reactState.restrictAccess();
			}
		})
	}

	render() {

		return (
			<Layout className="layout">
				<Layout>
					{
						this.state.showLoader ?
							<Loader />
							:
							<Content className="ui-container">
								<div style={{ marginBottom: this.state.showHeader ? "7em" : "2em" }}>{this.state.showHeader && <Header handleClick={this.handleClick} />}</div>
								{this.state.noAccess ?
									<NoAccess />
									:
									<Switch>
										<Route exact path='/' component={HomePage} />
										<Route path='/editor' component={Editor} />
										<Route path='/story' component={Story} />
										<Route path='/admin' component={Admin} />
										<Route path='/storylist' component={StoryListing} />
										<Route path='/profile' component={Profile} />
										<Route path='/signin' component={SignIn} />
										<Route path='/login' component={Login} />
										<Route path='/cropimage' component={CropImage} />

										<Route path='/test' component={Test} />
									</Switch >
								}
							</Content>
					}
				</Layout>
			</Layout>
		);
	}

}

export default withRouter(AppRouter);

