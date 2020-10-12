import React, { Component } from 'react';
import { BrowserRouter, Switch, Route, Link, Redirect } from 'react-router-dom'

import Login from './components/login/login'
import Register from './components/register/register'
import Home from './components/home/home'
import VideoChat from './components/video/videochat'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <Route path='/register' component={Register} />
        <ProtectedRoute path='/videochat' component={VideoChat} />
        <ProtectedRoute path='/' component={Home} />
      </Switch>
    </BrowserRouter>
  );
}

const ProtectedRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (sessionStorage.getItem('user')) { return <Component {...rest} {...props} /> }
        return <Redirect to='/login' />
      }}
    />
  )
}

export default App;
