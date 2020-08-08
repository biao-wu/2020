import React, { Component } from 'react'
import Admin from "./component/admin"
import { Route, Switch, Redirect } from "react-router-dom"
import { homeRoutes } from "./route"

export default class App extends Component {
  render() {
    return (
      <div>
        <Admin>
          <Switch>
            {
              homeRoutes.map(item=>{
                return <Route key={item.path} path={item.path} component={item.component} />
              })
            }
            <Redirect from="/home" to="/home/loginLogs" exect />
            <Redirect from="/home" to="/login" />
          </Switch>
        </Admin>
      </div>
    )
  }
}
