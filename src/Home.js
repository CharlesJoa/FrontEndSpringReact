import React, { Component } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { withCookies } from 'react-cookie';

class Home extends Component {
    state = {
        isLoading: true,
        isAuthenticated: false,
        user: undefined
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.csrfToken = cookies.get('XSRF-TOKEN');
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
    }

    async componentDidMount() {
        const response = await fetch('/api/user', {credentials: 'include'});
        const body = await response.text();
        if (body === '') {
            this.setState(({isAuthenticated: false}))
        } else {
            this.setState({isAuthenticated: true, user: JSON.parse(body)})
        }
    }

    login() {
        let port = (window.location.port ? ':' + window.location.port : '');
        if (port === ':3000') {
            port = ':8081';
        }
        window.location.href = '//' + window.location.hostname + port + '/private';
    }

    logout() {
        fetch('/api/logout', {method: 'POST', credentials: 'include',
            headers: {'X-XSRF-TOKEN': this.state.csrfToken}}).then(res => res.json())
            .then(response => {
                window.location.href = response.logoutUrl + "?id_token_hint=" +
                    response.idToken + "&post_logout_redirect_uri=" + window.location.origin;
            });
    }

    render() {
        const questions = [
            {id: 1, title: "Do you like icecream", votes: 15, hasVoted: true},
            {id: 2, title: "Do you want to live forever", votes: 1337, hasVoted: false},
            {id: 3, title: "Have you found wally?", votes: 99999, hasVoted: false},
        ]
        const message = this.state.user ?
            <h2>Welcome, {this.state.user.name}!</h2> :
            <p>Connect your-self to set up your votes</p>;

        const button = this.state.isAuthenticated ?
            <div>
                <Button color="link"><Link to="/groups">blablba</Link></Button>
                <br/>
                <Button color="link" onClick={this.logout}>Logout</Button>
            </div> :
            <Button color="primary" onClick={this.login}>Login</Button>;

        const votes= questions.map(question =>{
                return <div>
                        <div>
                            <div>"Question: "{question.title}</div>
                            <div>"Number of votes: {question.votes}</div>

                        </div>

                    </div>
            });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    {message}
                    {button}
                </Container>
                <Container fluid>
                    <h2>Votes</h2>
                    {votes}
                </Container>
            </div>
        );
    }
}

export default withCookies(Home);