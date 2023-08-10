const queenbox = document.getElementById("inputbox");
const slider = document.getElementById("slider");
const playbtn = document.getElementById("run-btn");
const progressmeter = document.getElementById("progress-meter");
const queenarrangements = document.getElementById("queen-arrangements");

const queenimg = '<i class="fas fa-chess-queen" style="color:#000"></i>';
const arrangement = [2,1,1,3,11,5,42,93];

playbtn.addEventListener("click",visualize);

let speed = (100-slider.value) * 10;
let tempspeed = speed;
slider.oninput = function () {
    speed = (100-slider.value) * 10;
}

function makeboards(n){
    while (queenarrangements.firstChild) {
        queenarrangements.removeChild(queenarrangements.firstChild);
    }
    for(let b = 0;b<arrangement[n-1];b++){
        let entry = document.createElement('div');
        let chessboard = document.createElement('table');
        chessboard.setAttribute('id',`table-${b}`);
        entry.setAttribute('class','entry');
        let head = document.createElement('header');
        let temporary = b + 1;
        head.innerText = "Board " + temporary;
        entry.appendChild(head);
        for(let i = 0;i<n;i++){
            let row = document.createElement('tr');
            for(let j = 0;j<n;j++){
                let col = document.createElement('td');
                col.setAttribute('id',`${b}-${i}-${j}`);
                if(i%2 == 0){
                    if(j % 2 == 0){
                        col.style.backgroundColor = "#FF9F1C";
                    }else{
                        col.style.backgroundColor = "#FCCD90";
                    }
                }else{
                    if(j % 2 == 0){
                        col.style.backgroundColor = "#FCCD90";
                    }else{
                        col.style.backgroundColor = "#FF9F1C";
                    }
                }
                row.appendChild(col);
            }
            chessboard.appendChild(row);
        }
        entry.appendChild(chessboard);
        queenarrangements.appendChild(entry);
    }
}

delay = async () => {
    await new Promise((done) => setTimeout(() => done(), speed));
}

async function isvalid(n,current_col,current_row,board){
    let curr_col,curr_row;
    curr_col = current_col - 1;
    curr_row = current_row - 1;
    //left diagnol
    while(curr_col >= 0 && curr_row >= 0){
        if(board[curr_row][curr_col] == -1){
            curr_col--;
            curr_row--;
            // await delay;
        }else{
            return false;
        }
    }
    //right diagnol
    curr_col = current_col + 1;
    curr_row = current_row - 1;
    while(curr_col < n && curr_row >= 0){
        if(board[curr_row][curr_col] == -1){
            curr_col++;
            curr_row--;
            // await delay;
        }else{
            return false;
        }
    }
    //top
    curr_row = current_row - 1;
    curr_col = current_col;
    while(curr_row >= 0){
        if(board[curr_row][curr_col] == -1){
            curr_row--;
            // await delay;
        }else{
            return false;
        }
    }
    return true;
}

async function placequeens(n){
    let placement_arr = [];
    let last_arr = [];
    for(var i = 0; i<n;i++){
        placement_arr[i] = []; 
        for(var j = 0;j<n;j++){
            placement_arr[i][j] = -1;
        }
    }
    for(let j = 0;j<n;j++){
        last_arr[j] = 0;
    }
    for(let b = 0;b<arrangement[n-1];b++){
        let curr = 0;
        while(curr < n){
            if(curr < 0){
                break;
            }
            if(last_arr[curr] < n){
                let column = last_arr[curr];
                placement_arr[curr][column] = 1;
                let curr_box = document.getElementById(`${b}-${curr}-${last_arr[curr]}`);
                curr_box.innerHTML = queenimg;
                await delay();
                let truth = await isvalid(n,last_arr[curr],curr,placement_arr);
                if(truth == true){
                    curr++;
                }else{
                    placement_arr[curr][last_arr[curr]] = -1;
                    last_arr[curr]++;
                    //remove queen;
                    curr_box.innerHTML = "";
                }
            }else{
                last_arr[curr] = 0;
                curr--;
                let temp_del = document.getElementById(`${b}-${curr}-${last_arr[curr]}`);
                temp_del.innerHTML = '';
                placement_arr[curr][last_arr[curr]] = -1;
                last_arr[curr]++;
            }
        }
        if(curr == n){
            curr--;
            placement_arr[curr][last_arr[curr]] = -1;
            last_arr[curr]++;
        }
    }
}

async function visualize(){
    if(queenbox.value < 1){
        progressmeter.innerText = "The value of queens is too low";
        queenbox.disable = true;
        return;
    }
    if(queenbox.value > 8){
        progressmeter.innerText = "The value of queens is too high";
        queenbox.disable = true;
        return;
    }
    let temp_arrangements = arrangement[queenbox.value-1] - 1;
    progressmeter.innerText = "There are " + temp_arrangements + " possible arrangements for " + queenbox.value + " queens";
    // make boards of size n*n
    await makeboards(queenbox.value);
    
    //visualize
    await placequeens(queenbox.value);
}