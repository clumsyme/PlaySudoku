import React, { Component } from 'react';
import sudokus from './Sudokus'
import SudokuGenerator from './SudokuGenerator'
import logo from './media/logo.png'
import Info from './Info'

class Board extends Component {
    getsquares(rowindex) {
        var squares = [...'012345678'].map((i, squareindex) => {
            var cord = rowindex + '' + squareindex
              , className = 'square'
            if (this.props.origin.has(cord)) { className += ' origin' }
            if (this.props.highlight.has(cord)) { className += ' highlight' }
            if (this.props.filter.has(cord)) { className += ' filter' }
            if (this.props.conflict.has(cord)) { className += ' conflict' }
            if (this.props.chosen === cord) { className += ' chosen' }
            return (
                <button key={squareindex} className={className} onClick={() => this.props.onClick(rowindex, squareindex)}>
                    {this.props.values[rowindex][squareindex]}
                </button>
            )
        })
        return (
            <div key={rowindex} className={'row ' + rowindex}>
                {squares}
            </div>
        )
    }
    render() {
        var rows = [...'012345678'].map((i, rowindex) => {
            return this.getsquares(rowindex)
        })
        return (
            <div className='board'>
                {rows}
            </div>
        )
    }
}

class Game extends Component {
    constructor(props) {
        super(props)
        this.check = this.check.bind(this)
        this.solve = this.solve.bind(this)
        this.help = this.help.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }
    generate(level) {
        var puzzles
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
        var grid = puzzles[Math.floor(Math.random() * puzzles.length)]
            , sudoku = new SudokuGenerator(grid).generate()
            , puzzle = sudoku[0]
        this.solution = sudoku[1]
        const origin = new Set()
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (puzzle[i][j]) {
                    origin.add(i + '' + j)
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
    componentWillMount() {
        this.generate('简单')
    }
    checkPossible(i, j) {
        var values = this.state.values
        var allPossible = new Set([...'123456789'])
        for (let k = 0; k <= 8; k++) {
            if (k === j) { continue }
            if (allPossible.has(values[i][k])) {
                allPossible.delete(values[i][k])
            }
        }
        for (let k = 0; k <= 8; k++) {
            if (k === i) { continue }
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
                    filter.add(m + '' + n)
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
                highlight.add(i + '' + k)
            }
        }
        for (let k = 0; k < 9; k++) {
            if (values[k][j]) {
                highlight.add(k + '' + j)
            }
        }
        var line = Math.floor(i / 3) * 3,
            row = Math.floor(j / 3) * 3
        for (let ln = line; ln < line + 3; ln++) {
            for (let r = row; r < row + 3; r++) {
                if (values[ln][r]) {
                    highlight.add(ln + '' + r)
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
        if (!chosen || this.state.origin.has(chosen[0] + '' + chosen[1]) || !this.state.helps) {
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
                    } else {
                        var thisvalue = values[i][j],
                            possible = this.checkPossible(i, j)
                        if (!possible.has(thisvalue)) {
                            conflict.add(i + '' + j)
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
            this.setState({
                values: this.solution,
                peep: true,
                conflict: new Set(),
                highlight: new Set(),
                filter: new Set(),
            })
        }

    }
    handleClick(i, j) {
        var values = this.state.values.slice()
        var thisvalue = values[i].slice()
        if (this.state.origin.has(i + '' + j)) {
            this.filter(thisvalue[j])
            return
        } else {
            this.highlight(i, j)
            var chosen = i + '' + j
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
        if (this.state.peep) { return }
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
                    } else {
                        var thisvalue = values[i][j],
                            possible = this.checkPossible(i, j)
                        if (!possible.has(thisvalue)) {
                            conflict.add(i + '' + j)
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
    render() {
        var peep = this.state.peep ? ' peep' : ''
        var checking = this.state.check ? ' checking' : ''
        var hinttime = [' zero', ' one', ' two', ' three'][this.state.helps]
        var choices = [...'123456789'].map((i) => {
            return <button key={i} className="choice" value={i} onClick={() => this.handleNumsClick(i)}>{i}</button>
        })
        var controls = ['非常简单', '简单', '中等', '困难', '非常困难'].map((level, index) => {
            var active = level === this.state.level ? ' active' : ''
            return <li key={index} className={"level" + active} onClick={() => this.generate(level)}>{level}</li>
        })
        return (
            <div className="game">
                <img className="logo" alt="PlaySudoku" src={logo} />
                <ul className="controls">
                    {controls}
                </ul>
                <div className="main">
                    <div className="left">
                        <button className="delete" onClick={() => this.handleNumsClick("X")} />
                        <div className={"checktext" + checking}>
                            <p value={this.state.possible}>{this.state.possible}</p>
                        </div>
                        <button className="check" onClick={this.check} />
                    </div>
                    <Board values={this.state.values}
                        origin={this.state.origin}
                        filter={this.state.filter}
                        conflict={this.state.conflict}
                        chosen={this.state.chosen}
                        highlight={this.state.highlight}
                        onClick={this.handleClick} />
                    <div className="right">
                        <button className={"solve" + peep} onClick={this.solve} />
                        <button className={"hint" + hinttime} onClick={this.help} />
                    </div>
                </div>
                <ul className="choices">
                    {choices}
                </ul>
                <Info />
            </div>
        );
    }
}
export default Game
