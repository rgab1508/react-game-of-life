import React from 'react'

import Grid from './Grid'
import Buttons from './Buttons'


class Main extends React.Component {
  constructor() {
    super()
    this.speed = 100
    this.rows = 30
    this.cols = 50
    this.state = {
      generation: 0,
      gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    }
    console.log(this.state.gridFull)
  }

  selectBox(row, col){
    let gridFullCopy = arrayClone(this.state.gridFull)
    gridFullCopy[row][col] = !gridFullCopy[row][col]
    this.setState({
      gridFull: gridFullCopy
    })
  }

  seed = () => {
    let gridFullCopy = arrayClone(this.state.gridFull)
    for (let i = 0; i < this.rows; i++) {
      for(let j = 0; j < this.cols; j++){
        if(Math.floor(Math.random() * 4)  === 1){
          gridFullCopy[i][j] = true
        }
      }
    }
    this.setState({
      gridFull: gridFullCopy
    })    
  }

  slow = () => {
    this.speed = 1000
    this.playButton()
  }

  fast = () => {
    this.speed = 100
    this.playButton()
  }

  clear = () => {
    let g = Array(this.rows).fill().map(() => Array(this.cols).fill(false))
    this.setState({
      gridFull: g,
      generation:0
    })
  }

  gridSize = size => {
    switch (size) {
      case "1":
        this.cols = 20
        this.rows = 10
        break
      case "2":
        this.cols = 50
        this.rows = 30
        break
      default:
        this.cols = 70
        this.rows = 50
    }
    this.clear()
  }

  playButton = () => {
    clearInterval(this.intervalId)
    this.intervalId = setInterval(this.play, this.speed)
  }

  pauseButton = () => {
    clearInterval(this.intervalId)
  }

  play = () => {
    let g = this.state.gridFull
    let g2 = arrayClone(this.state.gridFull)

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let count = 0;
        if (i > 0) if (g[i - 1][j]) count++;
        if (i > 0 && j > 0) if (g[i - 1][j - 1]) count++;
        if (i > 0 && j < this.cols - 1) if (g[i - 1][j + 1]) count++;
        if (j < this.cols - 1) if (g[i][j + 1]) count++;
        if (j > 0) if (g[i][j - 1]) count++;
        if (i < this.rows - 1) if (g[i + 1][j]) count++;
        if (i < this.rows - 1 && j > 0) if (g[i + 1][j - 1]) count++;
        if (i < this.rows - 1 && this.cols - 1) if (g[i + 1][j + 1]) count++;
        if (g[i][j] && (count < 2 || count > 3)) g2[i][j] = false;
        if (!g[i][j] && count === 3) g2[i][j] = true;
      }
    }

    this.setState({
      gridFull: g2,
      generation: this.state.generation + 1
    })
  }

  componentDidMount(){
    this.seed()
    this.playButton()
  }

  render() {
    return (
      <div>
        <h1>Gabriel's Game Of Life</h1>
        <Buttons 
          playButton={this.playButton}
          pauseButton={this.pauseButton}
          slow={this.slow}
          fast={this.fast}
          clear={this.clear}
          seed={this.seed}
          gridSize={this.gridSize}
        />
        <Grid 
          gridFull={this.state.gridFull}
          rows={this.rows}
          cols={this.cols}
          selectBox={this.selectBox.bind(this)}
        />
        <h3>Generations: {this.state.generation}</h3>
      </div>
    )
  }
}


function arrayClone(arr){
  return JSON.parse(JSON.stringify(arr))
}

export default Main