import React from 'react'
import { Switch, Route, Redirect} from 'react-router'

import Home from '../components/home/Home'
import ProdutosCrud from '../components/produtos/ProdutosCrud'

export default props =>
    <Switch>
        <Route exact path='/' component={Home} />
        <Route path='/produtos' component={ProdutosCrud} />
        <Redirect from='*' to="/" />
    </Switch>