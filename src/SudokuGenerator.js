class SudokuGenerator {
    constructor(grid) {
        this.grid = grid
        this.nums = [...'123456789']
        this.chars = [...'ABCDEFGHI']
    }
    shuffleArray(array) {
        for (let i = array.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [array[i - 1], array[j]] = [array[j], array[i - 1]];
        }
    }
    shuffleGrid() {
        var nums, chars, shuffledNums, shuffledChars,
            index1, index2, index3, index, rotate,
            numMap, charMap, tempGrid, grid
        grid = this.grid
        nums = this.nums.slice()
        chars = this.chars.slice()
        index1 = [0, 1, 2]
        index2 = [3, 4, 5]
        index3 = [6, 7, 8]
        // shuffle symbols
        shuffledNums = nums.slice()
        shuffledChars = []
        this.shuffleArray(shuffledNums)
        for (let num of shuffledNums) {
            shuffledChars.push(chars[parseInt(num, 10)-1])
        }
        numMap = new Map()
        charMap = new Map()
        for (let i=0; i<9; i++) {
            numMap.set(nums[i], shuffledNums[i])
        }
        for (let i=0; i<9; i++) {
            charMap.set(chars[i], shuffledChars[i])
        }
        tempGrid = ''
        for (let c of grid) {
            if (numMap.has(c)) {
                tempGrid += numMap.get(c)
            }else {
                tempGrid += charMap.get(c)
            }
        }
        grid = tempGrid
        // shuffle rows
        this.shuffleArray(index1)
        this.shuffleArray(index2)
        this.shuffleArray(index3)
        index = index1.concat(index2).concat(index3)
        tempGrid = ''
        for (let i of index) {
            tempGrid += grid.slice(i*9, i*9+9)
        }
        grid = tempGrid
        // shuffle cols
        this.shuffleArray(index1)
        this.shuffleArray(index2)
        this.shuffleArray(index3)
        index = index1.concat(index2).concat(index3)
        tempGrid = ''
        for (let i = 0; i<9; i++) {
            for (let j of index){
                tempGrid += grid.slice(i*9, i*9+9)[j]
            }
        }
        grid = tempGrid
        // shuffle blockRows
        this.shuffleArray(index1)
        tempGrid = ''
        for (let i of index1) {
            tempGrid += grid.slice(i*3*9, i*3*9+27)
        }
        grid = tempGrid
        // shuffle blockCols
        this.shuffleArray(index1)
        tempGrid = ''
        for (let i = 0; i < 9; i++) {
            for (let j of index1){
                tempGrid += grid.slice(i*9, i*9+9).slice(j*3, j*3+3)
            }
        }
        grid = tempGrid
        // rotate left | none | right
        tempGrid = ''
        rotate = [-1, 0, 1][Math.floor(Math.random()*3)]
        if (rotate === 0){
        }else if (rotate === -1) {
            for (let i = 8; i >= 0; i--) {
                for (let j = 0; j <=8; j++) {
                    tempGrid += grid[j*9+i]
                }
            }
            grid = tempGrid
        }else {
            for (let i = 0; i <= 8; i++) {
                for (let j = 8; j >= 0; j--) {
                    tempGrid += grid[j*9+i]
                }
            }
            grid = tempGrid
        }
        return grid
    }

    generate() {
        var numSet = new Set(this.nums)
        var charSet = new Set(this.chars)
        var map = new Map()
        for (let i = 0; i <= 8; i++) {
            map.set(this.chars[i], this.nums[i])
        }
        var pattern = this.shuffleGrid()
        var puzzle = []
        for (let i = 0; i <= 8; i++) {
            let row = []
            for (let j = 0; j <= 8; j++) {
                if (numSet.has(pattern[9*i+j])) {
                    row.push(pattern[9*i+j])
                }else {
                    row.push(null)
                }
            }
            puzzle.push(row)
        }
        var solution = []
        for (let i = 0; i <= 8; i++) {
            let row = []
            for (let j = 0; j <= 8; j++) {
                if (charSet.has(pattern[9*i+j])) {
                    row.push(map.get(pattern[9*i+j]))
                }else {
                    row.push(pattern[9*i+j])
                }
            }
            solution.push(row)
        }
        return [puzzle, solution]
    }
}
export default SudokuGenerator