import React, { Component } from 'react'
import Main from '../template/Main'
import axios from 'axios'


const headerProps = {
    icon: 'product-hunt',
    title: 'Produtos',
    subtitle: 'Cadastro de Produtos: Incluir, Listar, Alterar e Excluir!'
}

const baseUrl = 'https://restapicrud-biel.herokuapp.com/produtos'

const initialState = {
    produtos: { descricao: '', quantidade: '', valorUni:'', dataEntrada:'', imgLink:''},
    list: []
}

export default class ProdutosCrud extends Component {
    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }
    clear() {
        this.setState({ produtos: initialState.produtos})
    }
    save() {
        const produtos = this.state.produtos;
        produtos.quantidade = parseInt(produtos.quantidade, 10);
        produtos.valorUni = parseFloat(produtos.valorUni);
        const method = produtos.id ? 'put' : 'post'
        const url = produtos.id ? `${baseUrl}/${produtos.id}` : baseUrl
        axios[method](url, produtos)
            .then(resp => {
                const list = this.getUpdatedList(resp.data)
                this.setState({produtos: initialState.produtos, list })
            })
    }

    getUpdatedList(produtos, add = true) {
        const list = this.state.list.filter(p => p.id !== produtos.id)
        if(add) {
            list.unshift(produtos)
        }
        return list
    }

    updateField(event) {
        const produtos = { ...this.state.produtos }
        produtos[event.target.name] = event.target.value
        this.setState({ produtos })
    }
    renderForm(){
        return (
            <div className="form">
                <div className="row">
                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Descrição</label>
                            <input type="text" className="form-control"
                            name="descricao"
                            value={this.state.produtos.descricao}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite a descrição..."/>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Quantidade</label>
                            <input type="number" className="form-control"
                            name="quantidade"
                            value={this.state.produtos.quantidade}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite a quantidade..."/>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Valor Unitário</label>
                            <input type="text" className="form-control"
                            name="valorUni"
                            value={this.state.produtos.valorUni}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o valor da unidade utilizando PONTO ..."/>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Data de Entrada</label>
                            <input type="date" className="form-control"
                            name="dataEntrada"
                            value={this.state.produtos.dataEntrada}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite a data de entrada..."/>
                        </div>
                    </div>

                    <div className="col-12 col-md-6">
                        <div className="form-group">
                            <label>Link da Img</label>
                            <input type="text" className="form-control"
                            name="imgLink"
                            value={this.state.produtos.imgLink}
                            onChange={e => this.updateField(e)}
                            placeholder="Digite o link da img..."/>
                        </div>
                    </div>
                </div>

                <hr/>
                <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                        <button className="btn btn-primary" 
                            onClick={e => this.save(e)}>
                            Salvar
                        </button>
                        <button className="btn btn-secundary ml-2"
                            onClick={e => this.clear(e)}>
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    load(produtos) {
        this.setState({ produtos })
    }

    remove(produtos) {
        axios.delete(`${baseUrl}/${produtos.id}`).then(resp => {
            const list = this.getUpdatedList(produtos, false) 
            this.setState( {list} )
        })
    }

    renderTable() {
        return (
            <table className="table mt-7">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Descrição</th>
                        <th>Quantidade</th>
                        <th>Valor Uni</th>
                        <th>Data de entrada</th>
                        <th>Link da Img</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {this.renderRows()}
                </tbody>
            </table>
        )
    }

    renderRows() {
        return this.state.list.map(produtos => {
            return (
                <tr key={produtos.id}>
                    <td>{produtos.id}</td>
                    <td>{produtos.descricao}</td>
                    <td>{produtos.quantidade}</td>
                    <td>R$ {parseFloat(produtos.valorUni).toFixed(2)}</td>
                    <td>{produtos.dataEntrada}</td>
                    <td><a href={produtos.imgLink}>Imagem</a></td>
                    <td>
                        <button className="btn btn-warning" 
                        onClick={() => this.load(produtos)}>
                            <i className="fa fa-pencil"></i>
                        </button>
                        <button className="btn btn-danger ml-2"
                        onClick={() => this.remove(produtos)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </td>
                </tr>
            )
        })   
    }

    render() {
        return (
            <Main {...headerProps}>
                {this.renderForm()}
                {this.renderTable()}
            </Main>
        )
    }
}