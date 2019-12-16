process.stdin.setEncoding('utf8');

// This function reads only one line on console synchronously. After pressing `enter` key the console will stop listening for data.
function readlineSync() {
  return new Promise((resolve, reject) => {
      process.stdin.resume();
      process.stdin.on('data', function (data) {
          process.stdin.pause(); // stops after one line reads
          resolve(data);
      });
  });
}

const compose = function(f:any, g:any) {
  return function(x:string) {
    return f(g(x));
  };
};

function initTable(n:number){
  var table = new Array(n);
  for(var i=0; i<n; i++){
    table[i] = new Array(n);
    for(var j=0; j<n; j++) table[i][j] = ".";
  }
  table[n/2][n/2] = table[n/2-1][n/2-1] = "O";
  table[n/2-1][n/2] = table[n/2][n/2-1] = "X";
  return table;
}

const max = (a:number, b:number) => a > b ? a : b
const abs = (n:number) => max(n, -n)
var char2num = (str:string) => [str.charCodeAt(0) - 97, str.charCodeAt(1) - 97];

function printBoard(table:string[][], n:number){
  process.stdout.write(" ");
  for(var i=0; i<n; i++){
    process.stdout.write(" " + String.fromCharCode(97+i));
  }
  process.stdout.write("\n");
  for(var i=0; i<n; i++){
    process.stdout.write(String.fromCharCode(97+i));
    for(var j=0; j<n; j++){
      process.stdout.write(" " + table[i][j]);
    }
    process.stdout.write("\n");
  }
}

function isLegal(table:string[][], n:number, site:string, type:string):[boolean, number[], number]{  // 判断落子位置是否合法
  var [y, x] = char2num(site);
  var flag = false;
  var dir = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]; // 匹配成功方向，从上顺时针依次为 1~8
  var score = 0; // 最佳匹配得分
  if(x < 0 || x >= n || y < 0 || y >= n || table[y][x] != '.') return [false, dir, score];
  for(var temp_y=y-1; temp_y >= 0 && table[temp_y][x] != '.'; temp_y--){  // 上
    if(table[temp_y][x] == type){
      if(abs(y-temp_y) == 1) break;
      flag = true;
      dir[1] = abs(y-temp_y)-1;
      break;
    }
  }
  for(var temp_y=y+1; temp_y < n && table[temp_y][x] != '.'; temp_y++){  // 下
    if(table[temp_y][x] == type){
      if(abs(y-temp_y) == 1) break;
      flag = true;
      dir[5] = abs(y-temp_y)-1;
      break;
    }
  }
  for(var temp_x=x-1; temp_x >= 0 && table[y][temp_x] != '.'; temp_x--){  // 左
    if(table[y][temp_x] == type){
      if(abs(x-temp_x) == 1) break;
      flag = true;
      dir[7] = abs(x-temp_x)-1;
      break;
    }
  }
  for(var temp_x=x+1; temp_x < n && table[y][temp_x] != '.'; temp_x++){  // 右
    if(table[y][temp_x] == type){
      if(abs(x-temp_x) == 1) break;
      flag = true;
      dir[3] = abs(x-temp_x)-1;
      break;
    }
  }
  for(var temp_x=x-1, temp_y=y-1; temp_x >= 0 && temp_y >= 0 && table[temp_y][temp_x] != '.'; temp_x--, temp_y--){  // 左上
    if(table[temp_y][temp_x] == type){
      if(abs(y-temp_y) == 1) break;
      flag = true;
      dir[8] = abs(y-temp_y)-1;
      break;
    }
  }
  for(var temp_x=x+1, temp_y=y-1; temp_x < n && temp_y >= 0 && table[temp_y][temp_x] != '.'; temp_x++, temp_y--){  // 右上
    if(table[temp_y][temp_x] == type){
      if(abs(y-temp_y) == 1) break;
      flag = true;
      dir[2] = abs(y-temp_y)-1;
      break;
    }
  }
  for(var temp_x=x+1, temp_y=y+1; temp_x < n && temp_y < n && table[temp_y][temp_x] != '.'; temp_x++, temp_y++){  // 右下
    if(table[temp_y][temp_x] == type){
      if(abs(y-temp_y) == 1) break;
      flag = true;
      dir[4] = abs(y-temp_y)-1;
      break;
    }
  }
  for(var temp_x=x-1, temp_y=y+1; temp_x >= 0 && temp_y < n && table[temp_y][temp_x] != '.'; temp_x--, temp_y++){  // 左下
    if(table[temp_y][temp_x] == type){
      if(abs(y-temp_y) == 1) break;
      flag = true;
      dir[6] = abs(y-temp_y)-1;
      break;
    }
  }
  score = dir[1] + dir[2] + dir[3] + dir[4] + dir[5] + dir[6] + dir[7] + dir[8];
  return [flag, dir, score];
}

function judgeOptional(table:string[][], n:number, type:string):[boolean, string, number[], number]{
  var max_flag = false;
  var max_site = "";
  var max_dir = new Array(10);
  var max_score = 0;
  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      var site = String.fromCharCode(97+i) + String.fromCharCode(97+j);
      var [flag, dir, score] = isLegal(table, n, site, type);
      if(flag){
        console.log(flag, site, dir, score);
        max_flag = flag;
        if(score > max_score){
          max_site = site;
          max_dir = dir;
          max_score = score;
        }
      }
    }
  }
  return [max_flag, max_site, max_dir, max_score];
}

function putPiece(table:string[][], n:number, site:string, dir:number[], type:string){
  var y = site.charCodeAt(0) - 97;
  var x = site.charCodeAt(1) - 97;
  for(var cnt = dir[1]; cnt >= 0; cnt--) table[y-cnt][x] = type;
  for(var cnt = dir[2]; cnt > 0; cnt--) table[y-cnt][x+cnt] = type;
  for(var cnt = dir[3]; cnt > 0; cnt--) table[y][x+cnt] = type;
  for(var cnt = dir[4]; cnt > 0; cnt--) table[y+cnt][x+cnt] = type;
  for(var cnt = dir[5]; cnt > 0; cnt--) table[y+cnt][x] = type;
  for(var cnt = dir[6]; cnt > 0; cnt--) table[y+cnt][x-cnt] = type;
  for(var cnt = dir[7]; cnt > 0; cnt--) table[y][x-cnt] = type;
  for(var cnt = dir[8]; cnt > 0; cnt--) table[y-cnt][x-cnt] = type;
}

function cntScore(table:string[][], n:number):[number, number]{
  var X_score = 0;
  var O_score = 0;
  for(var i=0; i<n; i++){
    for(var j=0; j<n; j++){
      if(table[i][j] == "X") X_score++;
      if(table[i][j] == "O") O_score++;
    }
  }
  return [X_score, O_score];
}

async function main(){
  process.stdout.write("Enter the board dimension: ");
  let n = await readlineSync() as number;  // nxn 棋盘，必须为偶数
  let table = initTable(n);  // 初始化棋盘
  process.stdout.write("Computer plays (X/O): ");
  let comptuer_type = (await readlineSync() as string).charAt(0);  // 电脑棋子类型
  let human_type = comptuer_type == "X" ? "O" : "X"; // 玩家的棋子类型
  let invalid_move_flag = false;
  printBoard(table, n);
  while(1){
    let [X_flag, X_site, X_dir, X_score] = judgeOptional(table, n, "X"); // 查看 X 是否存在可放位置
    if(X_flag){
      if("X" == comptuer_type){
        putPiece(table, n, X_site, X_dir, comptuer_type);
        console.log("Computer places X at " + X_site + ".");
      }
      else{
        process.stdout.write("Enter move for " + human_type + " (RowCol): ");
        let site = await readlineSync() as string;
        let [flag, dir, score] = isLegal(table, n, site, human_type);
        if(flag) putPiece(table, n, site, dir, human_type);
        else {
          console.log("Invalid move. ");
          invalid_move_flag = true;
          break;//否则输出错误，判电脑赢
        }
      }
      printBoard(table, n);
    }
    let [O_flag, O_site, O_dir, O_score] = judgeOptional(table, n, "O"); // 查看 O 是否存在可放位置
    if(O_flag){
      if(!X_flag) process.stdout.write("X player has no valid move. ");
      if("O" == comptuer_type){
        putPiece(table, n, O_site, O_dir, comptuer_type);
        console.log("Computer places O at " + O_site + ".");
      }
      else{
        process.stdout.write("Enter move for " + human_type + " (RowCol): ");
        let site = await readlineSync() as string;
        let [flag, dir, score] = isLegal(table, n, site, human_type);
        if(flag){
          putPiece(table, n, site, dir, human_type);
        }
        else {
          console.log("Invalid move. ");
          invalid_move_flag = true;
          break;//否则输出错误，判电脑赢
        }
      }
      printBoard(table, n);
    }
    else{
      if(!X_flag){
        process.stdout.write("Both players have no valid move.\n");
        break;
      }
      process.stdout.write("O player has no valid move. ");
    }
  }
  if(invalid_move_flag){
    console.log("Game over.");
    console.log(comptuer_type + " player wins.");
  }
  else{
    let [X_score, O_score] = cntScore(table, n);
    console.log("Game over.");
    console.log("X : O = " + X_score + " : " + O_score);
    if(X_score < O_score) console.log("O player wins.");
    else if(X_score > O_score) console.log("X player wins.");
    else console.log("Draw!");
  }
}

main();