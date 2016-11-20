import React, { Component } from 'react';
import sudokus from './Sudokus'
import SudokuGenerator from './SudokuGenerator'
import logo from './media/logo.png'
import Info from './Info'

let Square = props => 
  <button style={props.style} className={props.className} onClick={props.onClick}>
    {props.value}
  </button>

class Row extends Component {
    renderSquare(j) {
        var squareStyle,
            i = this.props.row,
            cord = i + '.' + j,
            chosen = this.props.chosen
        if (this.props.origin.has(cord)) {
            if (this.props.highlight.has(cord)) {
                squareStyle = this.props.styles.originHighlight
            } else if (this.props.filter.has(cord)) {
                squareStyle = this.props.styles.originFilter
            } else {
                squareStyle = this.props.styles.origin
            }
            if (this.props.conflict.has(cord)) {
                squareStyle = this.props.styles.originConflict
            }
        } else {
            if (this.props.highlight.has(cord)) {
                squareStyle = this.props.styles.highlight
            }else if (this.props.filter.has(cord)) {
                squareStyle = this.props.styles.filter
            }
            if (this.props.conflict.has(cord)) {
                squareStyle = this.props.styles.conflict
            }
        }
        if (chosen && (cord === chosen[0] + '.' + chosen[1])) {
            if (this.props.conflict.has(cord)) {
                squareStyle = this.props.styles.chosenConflict
            } else {
                squareStyle = this.props.styles.chosen
            }
        }

        return <Square style={squareStyle}
            className='square'
            row={this.props.row}
            col={j}
            value={this.props.values[j]}
            onClick={() => this.props.onClick(j)} />;
    }
    render() {
        return (
            <div style={this.props.style} className='row'>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        );
    }
}

class Board extends Component {
    renderRow(i) {
        return <Row values={this.props.values[i]}
            origin={this.props.origin}
            row={i}
            styles={this.props.styles}
            filter={this.props.filter}
            highlight={this.props.highlight}
            conflict={this.props.conflict}
            chosen={this.props.chosen}
            onClick={(j) => this.props.onClick(i, j)} />;
    }
    render() {
        return (
            <div className='board'>
                {this.renderRow(0)}
                {this.renderRow(1)}
                {this.renderRow(2)}
                {this.renderRow(3)}
                {this.renderRow(4)}
                {this.renderRow(5)}
                {this.renderRow(6)}
                {this.renderRow(7)}
                {this.renderRow(8)}
            </div>
        );
    }
}

let Control = props => 
  <li style={props.style} className={props.className} onClick={props.onClick}>
    {props.value}
  </li>

class Game extends Component {
    constructor(props) {
        super(props)
        this.check = this.check.bind(this)
        this.solve = this.solve.bind(this)
        this.help = this.help.bind(this)
        var random = Math.floor(Math.random() * 8),
            grid = sudokus.easy[random],
            sudoku = new SudokuGenerator(grid).generate(),
            puzzle = sudoku[0]
        this.solution = sudoku[1]
        const origin = new Set()
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j]) {
                    origin.add(i + '.' + j)
                }
            }
        }
        this.styles = {
            highlight: {
                backgroundColor: 'rgba(52, 168, 83, 0.2)',
                animation: 'highlight 2s'
            },
            filter: {
                boxShadow: '3px 3px 1px rgba(0, 0, 0, 0.8)',
                backgroundColor: 'rgba(255, 13, 126, 0.2)',
                color: '#4285f4',
            },
            chosen: {
                backgroundColor: 'rgba(155, 204, 20, 0.3)',
            },
            origin: {
                backgroundColor: 'rgba(200, 200, 200, 0.1)',
                color: '#ea4335'
            },
            originHighlight: {
                backgroundColor: 'rgba(52, 168, 83, 0.2)',
                color: '#ea4335'
            },
            originFilter: {
                backgroundColor: 'rgba(255, 13, 126, 0.2)',
                color: '#ea4335'
            },
            control: {
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#ea4335'
            },
            peep: {
                backgroundColor: 'rgba(251, 188, 5, 0.2)'
            },
            check: {
                filter: 'blur(0)'
            },
            conflict: {
                backgroundColor: 'rgba(255, 0, 0, 0.1)',
                fontWeight: 800
            },
            originConflict: {
                backgroundColor: 'rgba(255, 0, 0, 0.3)',
                color: '#ea4335'
            },
            chosenConflict: {
                backgroundColor: 'rgba(255, 0, 0, 0.6)',
                fontWeight: 800
            },
            hint: [
                {
                    transition: 'background-color 0.5s',
                    backgroundColor: 'rgba(52, 168, 83, 0.2)'
                },
                {
                    transition: 'background-color 0.5s',
                    backgroundColor: 'rgba(251, 188, 5, 0.2)'
                },
                {
                    transition: 'background-color 0.5s',
                    backgroundColor: 'rgba(255, 13, 126, 0.2)'
                }
            ]
        }
        this.state = {
            values: puzzle,
            level: '简单',
            origin: origin,
            peep: false,
            possible: null,
            chosen: null,
            filter: new Set(),
            highlight: new Set(),
            conflict: new Set(),
            check: false,
            helps: 3,
        }
    }
    generate(level) {
        let puzzles
        switch (level) {
            case '非常简单':
                puzzles = sudokus.veryeasy
                break
            case '简单':
                puzzles = sudokus.easy
                break
            case '中等':
                puzzles = sudokus.medium
                break
            case '困难':
                puzzles = sudokus.tough
                break
            case '非常困难':
                puzzles = sudokus.verytough
                break
            default:
                puzzles = sudokus.easy
        }
        var random = Math.floor(Math.random() * puzzles.length)
        var grid = puzzles[random],
            sudoku = new SudokuGenerator(grid).generate(),
            puzzle = sudoku[0]
        this.solution = sudoku[1]
        const origin = new Set()
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j]) {
                    origin.add(i + '.' + j)
                }
            }
        }
        this.setState({
            values: puzzle,
            level: level,
            peep: false,
            origin: origin,
            chosen: null,
            possible: null,
            filter: new Set(),
            highlight: new Set(),
            check: false,
            helps: 3,
            conflict: new Set()
        })
    }
    checkPossible(i, j) {
        var values = this.state.values
        var allPossible = new Set(['1', '2', '3', '4', '5', '6', '7', '8', '9'])
        for (let k = 0; k <= 8; k++) {
            if (k === j) {continue}
            if (allPossible.has(values[i][k])) {
                allPossible.delete(values[i][k])
            }
        }
        for (let k = 0; k <= 8; k++) {
            if (k === i) {continue}
            if (allPossible.has(values[k][j])) {
                allPossible.delete(values[k][j])
            }
        }
        var bi = Math.floor(i / 3) * 3,
            bj = Math.floor(j / 3) * 3
        for (let m = bi; m < bi + 3; m++) {
            for (let n = bj; n < bj + 3; n++) {
                  if (m === i && n === j) {
                      continue
                  }
                if (allPossible.has(values[m][n])) {
                    allPossible.delete(values[m][n])
                }
            }
        }
        return allPossible
    }
    filter(value) {
        var values = this.state.values
        var filter = new Set()
        for (let m = 0; m < 9; m++) {
            for (let n = 0; n < 9; n++) {
                if (values[m][n] === value) {
                    filter.add(m + '.' + n)
                }
            }
        }
        this.setState({
            filter: filter,
            highlight: new Set(),
            chosen: null
        })
    }
    highlight(i, j) {
        var values = this.state.values
        var highlight = new Set()
        for (let k = 0; k < 9; k++) {
            if (values[i][k]) {
                highlight.add(i + '.' + k)
            }
        }
        for (let k = 0; k < 9; k++) {
            if (values[k][j]) {
                highlight.add(k + '.' + j)
            }
        }
        var line = Math.floor(i / 3) * 3,
            row = Math.floor(j / 3) * 3
        for (let ln = line; ln < line + 3; ln++) {
            for (let r = row; r < row + 3; r++) {
                if (values[ln][r]) {
                    highlight.add(ln + '.' + r)
                }
            }
        }
        this.setState({
            highlight: highlight,
            filter: new Set()
        })
    }
    help() {
        var solution = this.solution,
            values = this.state.values.slice(),
            chosen = this.state.chosen,
            helps = this.state.helps
        if (!chosen.length || this.state.origin.has(chosen[0] + '.' + chosen[1]) || !this.state.helps) {
            return
        } else {
            var solutionValue = solution[chosen[0]][chosen[1]]
            values[chosen[0]][chosen[1]] = solutionValue
            helps -= 1
            var conflict = new Set()
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (!values[i][j]) {
                        continue
                    }else {
                        var thisvalue = values[i][j],
                        possible = this.checkPossible(i, j)
                        if (!possible.has(thisvalue)) {
                            conflict.add(i + '.' + j)
                        }   
                    }
                }
            }
            this.setState({
                values: values,
                helps: helps,
                conflict: conflict
            })
        }
    }
    check() {
        this.setState({
            check: true
        })
    }
    solve() {
        if (this.state.peep) {
            return
        }
        var r = confirm("你确定查看答案么？查看后将不能继续解题。")
        if (!r) {
            return
        } else {
            var solution = this.solution,
                peep = this.state.peep
            this.setState({
                values: solution,
                peep: !peep,
                conflict: new Set(),
                highlight: new Set(),
                filter: new Set(),
            })
        }

    }
    handleClick(i, j) {
        var values = this.state.values.slice()
        var thisvalue = values[i].slice()
        let chosen
        if (this.state.origin.has(i + '.' + j)) {
            this.filter(thisvalue[j])
            return
        } else {
            this.highlight(i, j)
            chosen = [i, j]
            var possible = Array.from(this.checkPossible(i, j)).toString()
            this.setState({
                chosen: chosen,
                possible: possible,
                filter: new Set(),
                check: false
            });
        }
    }
    handleNumsClick(i) {
        if (this.state.peep) {return}
        var chosen = this.state.chosen
        if (!chosen) {
            this.filter('' + i)
        } else {
            var values = this.state.values.slice()
            if (this.state.origin.has([chosen[0]][chosen[1]])) {
                this.setState({
                    chosen: null,
                    highlight: new Set()
                })
                return
            }
            if (i === 'X') {
                values[chosen[0]][chosen[1]] = null
            } else {
                values[chosen[0]][chosen[1]] = '' + i
            }
            var conflict = new Set()
            for (let i = 0; i < 9; i++) {
                for (let j = 0; j < 9; j++) {
                    if (!values[i][j]) {
                        continue
                    }else {
                        var thisvalue = values[i][j],
                        possible = this.checkPossible(i, j)
                        if (!possible.has(thisvalue)) {
                            conflict.add(i + '.' + j)
                        }   
                    }
                }
            }
            this.setState(
                {
                    values: values,
                    highlight: new Set(),
                    conflict: conflict,
                    chosen: null
                }
            )
            if (!this.state.peep && values.toString() === this.solution.toString()) {
                alert('恭喜你，完成了这个难题！')
                this.setState({
                    peep: true
                })
            }
            
        }
    }
    renderControl(value) {
        var controlStyle = value === this.state.level?this.styles.control:undefined
        return <Control style={controlStyle} className="level" value={value} onClick={() => this.generate(value)} />
    }
    render() {
        var peepStyle = this.state.peep?this.styles.peep:undefined
        var checkStyle = this.state.check?this.styles.check:undefined
        var hintStyle = this.styles.hint[2 - this.state.helps]
        var choices = ['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(
            (i) => {
                return <Square key={i} className="choice" value={i} onClick={() => this.handleNumsClick(i)} />
            }
        )
        return (
            <div className="game">
                <img className="logo" alt="PlaySudoku" src={logo} />
                <ul className="controls">
                    {this.renderControl("非常简单")}
                    {this.renderControl("简单")}
                    {this.renderControl("中等")}
                    {this.renderControl("困难")}
                    {this.renderControl("非常困难")}
                </ul>
                <div className="main">
                    <div className="left">
                        <button className="delete" value="X" onClick={() => this.handleNumsClick("X")} />
                        <div style={checkStyle} className="checktext">
                            <p value={this.state.possible}>{this.state.possible}</p>
                        </div>
                        <button className="check" value="?" onClick={this.check} />
                    </div>
                    <Board values={this.state.values}
                        origin={this.state.origin}
                        filter={this.state.filter}
                        conflict={this.state.conflict}
                        styles={this.styles}
                        chosen={this.state.chosen}
                        highlight={this.state.highlight}
                        onClick={(i, j) => this.handleClick(i, j)} />
                    <div className="right">
                        <button className="solve" style={peepStyle} value="O" onClick={this.solve} />
                        <button className="hint" style={hintStyle} value={this.state.helps} onClick={this.help} />
                        <Info />
                    </div>
                </div>
                <ul className="choices">
                    {choices}
                </ul>
            </div>
        );
    }
}
export default Game
