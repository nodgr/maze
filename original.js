var board = new Array(200);//それぞれの盤面の情報を入れる配列。
var direc = [-20,20,-1,1];//各マスでの進む方向を入れる(上,下,左,右).
var direcstr = ['上','下','左','右'];//各マスにすすめるかどうか
var nowroute = new Array();//現在進めているルートの道のりを収納。
var bestroute = new Array();//今までの最適ルートの道のりを格納する。

var routedir = new Array();//今迄進んだマスの全ての選択肢を収納

var mutate=0;

var back=false;//バックトラック中か

var pos = 21;//現在調べている位置
board[21] = 1;//スタート地点は調べ中

var direcboard = function(){//進める方向を調べる
        if(pos != 178){
        var retarray=[];//進める方向を日本語で収納する(順序は上下左右)。
        for(var i=0;i<4;i++){
                if(board[pos+direc[i]] == 0){
                    retarray.push(direcstr[i]);
                }
            
        }
        if(back){
            return retarray;
        }else{
            routedir.push(retarray);
            move(retarray);//向きを知ったら動かす。

        }
    }
}

function move(retarray){//実際に動かす。
    var rand = Math.floor(Math.random()*(retarray.length));//進める範囲で乱数生成
    if(retarray.length == 0){//進めなくなったらリセット
            back=true;
            backtrack();        
    }else{
        switch (retarray[rand]){//実際にposを進める
        case '上':
            insertArray(pos,'↑');//盤上に矢印を加える
            pos = pos -20;//現在位置を変更
            board[pos] = 1;//盤を調査済にする
            idtoBoard('s');//盤情報を反映
            if(pos == 178){firmRoute();}//ゴールしてたらルート判定する。
            nowroute.push(pos);//ルート探索が終わらなければ経路を追加していく
             break;        
        case '下':
            insertArray(pos,'↓');
            pos = pos +20;
            board[pos] = 1;
            idtoBoard('s');
            if(pos == 178){firmRoute();}
            nowroute.push(pos);
            break;
        case '左':
            insertArray(pos,'←');
            pos = pos -1;
            board[pos] = 1;
            idtoBoard('s');
            if(pos == 178){firmRoute();}
            nowroute.push(pos);
            break;
        case '右':
            insertArray(pos,'→');    
            pos = pos +1;
            board[pos] = 1;
            idtoBoard('s');
            if(pos == 178){firmRoute();}
            nowroute.push(pos);
            break;
        }
    } 
}

function backtrack(){//バックトラック関数
    var k=0;
    while(k<2){//選択肢が2つになるところまで戻る
        k=routedir[routedir.length-1].length;//routedirの最後の長さ
        if(k>=2){break;}//この時点で選択肢が増えてたら抜ける
        board[pos] = 0;//現在地を来なかったことにする
        idtoBoard('s');
        var maeroute = pos;//前に進んだルート
        pos = nowroute[nowroute.length-2];//現在地を戻す
        nowroute.pop();//ルートをひとつもどす。
        routedir.pop();
        document.getElementById('s'+pos).innerHTML='';//矢印を消す
    }
        if((routedir.length)>0){

            switch(maeroute-pos){//直前のマスとの差を調べて行き詰まった移動方向を特定
                case -20://上
                    for(var i=0;i<routedir[routedir.length-1].length;i++){
                        if(routedir[routedir.length-1][i] == '上'){
                        routedir[routedir.length-1].splice(i,1);
                            move(routedir[routedir.length-1]);
                        }
                    }
                    break;
                case 20://下
                    for(var i=0;i<routedir[routedir.length-1].length;i++){
                        if(routedir[routedir.length-1][i] == '下'){
                            routedir[routedir.length-1].splice(i,1);
                            move(routedir[routedir.length-1]);
                        }
                    }
                    break;
                case -1://左
                    for(var i=0;i<routedir[routedir.length-1].length;i++){
                        if(routedir[routedir.length-1][i] == '左'){
                            routedir[routedir.length-1].splice(i,1);
                            move(routedir[routedir.length-1]);
                        }
                    }
                    break;
                case 1://右
                    for(var i=0;i<routedir[routedir.length-1].length;i++){
                        if(routedir[routedir.length-1][i] == '右'){
                            routedir[routedir.length-1].splice(i,1);
                            move(routedir[routedir.length-1]);
                        }
                    }
                    break;
             }
          }
    back=false;
}
var timer;  

function start(){//開始プログラム
                    resetBoard('s');//盤面をリセット
                   
                    var timer = setInterval(
                        "direcboard()"
                         ,1);  
                }

function insertArray(pos,direction){//進んだ向きをマスに記入する
  document.getElementById('s'+pos).innerHTML=''+direction;
}

function resetBoard(b){//盤面をリセット
    for(var i=0;i<board.length;i++){
        if(i<21 || i>178 || i%20==0 || i%20==19){
            board[i] = 4;//外枠
        }else{
            board[i] = 0;
            document.getElementById(b+i).innerHTML='';
        }
        
       }
       if(b == 's'){
            pos =21;//スタート位置合わせ
            mutate++;
            board[21] = 1;
            board[34] = 3;
            nowroute = [];//ルートも初期化
            routedir = []; 
            back = false;
        　  idtoBoard(b);
        }
}

function idtoBoard(b){//board情報をhtmlに反映。
    for(var i=0;i<board.length;i++){
        if(i>20&&i<179&&i%20!=0&&i%20!=19){
            switch (board[i]){
            case 0://何もない
                document.getElementById(b+i).className = "square none";
                break;
            case 1://探索候補
                document.getElementById(b+i).className = "square kouho";
                break;
            case 2://確定
                document.getElementById(b+i).className = "square firm";
                break;    
            case 3://壁
                document.getElementById(b+i).className = "square wall";
            }
        }
    }
}

function firmRoute(){//導出した道のりが一番長いか検証
        for(var i=0;i<nowroute.length;i++){
            var copya = true;//盤の内容を↓に反映するかどうか
            board[nowroute[i]] = 2;
            bestroute[i] = nowroute[i]; 
            idtoBoard('a');      
        }
    if(copya == true){//下盤に反映させる
        resetBoard('a');
        for(var i=0;i<bestroute.length;i++){
                document.getElementById('a'+bestroute[i]).className='square firm';
                if(i<bestroute.length-1){
                    var shiki = bestroute[i+1]-bestroute[i]//移動前後のマスIDから移動方向を推定(下盤)
                    if( shiki ==1){
                        document.getElementById('a'+bestroute[i]).innerHTML='→';
                    }else if(shiki==-1){
                        document.getElementById('a'+bestroute[i]).innerHTML='←';
                    }else if(shiki==20){
                        document.getElementById('a'+bestroute[i]).innerHTML='↓';
                    }else if(shiki==-20){
                        document.getElementById('a'+bestroute[i]).innerHTML='↑';
                    }
                }              
        }
        copya = false;//反映済
    }
       
        document.getElementById('percent').innerHTML='合致％:'+(bestroute.length/63);//合致度を表示
        document.getElementById('mutate').innerHTML='試行回数:'+(mutate)+'回';//合致度を表示
    console.log('a');
}