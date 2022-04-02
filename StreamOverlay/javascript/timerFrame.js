var interval = null; // interval id
var start = null; // start time
var split = null; // split time
var cursplit = 0;

var display = document.getElementById('display');
var times = document.getElementById('times');
var table = document.getElementById('times');
var split_header_title = document.getElementById('split_header_title');
var split_attmts = document.getElementById('split_attmts');
var previous_split_timer = document.getElementById('previous_time');
var final_split_img = document.getElementById('final_split_img');
var final_split_title = document.getElementById('final_split_title');
var final_split_delta = document.getElementById('final_split_delta');
var final_split_time =  document.getElementById('final_split_time');

var split_delta;
var split_timer;
var run_delta = null;
var delta_time;
var pb;
var L;

var DAT_type, DAT_pulls, DAT_splits, DAT_name;
/*
    0 - img
    1 - split title
    2 - delta
    3 - pb run split
    4 - current run split
    5 - best split
*/

var dungeon_splits = [
    ["", "Pack 1", "", 10000, null, null], 
    ["", "Boss 1", "", 20000, null, null], 
    ["", "Pack 2 - 3", "", 30000, null, null], 
    ["", "Boss 2", "", 40000, null, null],
    ["", "Pack 4 - 5", "", 50000, null, null],
    ["", "Boss 3", "", 60000, null, null]
]
var split_List;

window.onload = () => {
    fetch("../data/splits.json").then(response => 
        response.json()).then(data => {
            split_List = data;
            
            DAT_name = split_List["DAT"]["Name"];
            DAT_pulls = split_List["DAT"]["Pulls"];
            DAT_splits = split_List["DAT"]["Splits"];
            DAT_type =  split_List["DAT"]["Type"];
            L = DAT_splits;
            split_header_title.innerHTML = DAT_name;
            split_attmts.innerHTML = DAT_pulls;
           
            for(x = 0; x < (L - 1); x++) {
                let element = split_List[x];
                let text = ""
                text += `<div class="table_row">`;
                if(element["img"] != "") {
                    text += ` <div class="split_img"><img src=${element["img"]}/></div>`;
                }
                text += ` <div class="split_title">${element["Split Name"]}</div>`
                if(element["PB Run"] == null) {
                    text += ` <div class="split_time" id="id${x}">-</div>`
                }
                else {
                    text += ` <div class="split_time" id="id${x}">${toTime(element["PB Run"])}</div>`
                }
                text += ` <div class="split_delta" id="d${x}" data-value=""></div></div>`;
                table.innerHTML += text;
            }
            final_split_img.setAttribute('src', split_List[L - 1]["img"]);
            final_split_title.innerHTML = split_List[L - 1]["Split Name"];
            final_split_delta.innerHTML = split_List[L - 1]["Delta"];
            final_split_time.innerHTML = toTime(split_List[L - 1]["PB Run"]);
        });
};

function cleanUI() {
    var oldSplitTime = document.getElementsByClassName("split_time");
    var oldSplitDelta = document.getElementsByClassName("split_delta")
    for(var x = 0; x < oldSplitTime.length; x++) {
        if(split_List[x]["PB Run"] != null) {
            oldSplitTime[x].innerHTML = toTime(split_List[x]["PB Run"]); 
        }
        else {
            oldSplitTime[x].innerHTML = "-"
        }
        oldSplitDelta[x].innerHTML = "";
        oldSplitTime[x].style = oldSplitDelta[x].style = "";
    }
    final_split_delta.innerHTML = split_List[L - 1]["Delta"];
    final_split_time.innerHTML = toTime(split_List[L - 1]["PB Run"]);
    split_attmts.innerHTML = DAT_pulls;

    previous_time.innerHTML = "-"
    previous_time.style = "";
}

function startStopwatch() {
    cursplit = 0;
    cleanUI();

    if(interval)
        return;
    
    run_delta = null;
    start = new Date();
    split = start;
    pb = split_List[cursplit]["PB Run"];
    function tick() {
        var now = new Date();
        delta_time = (now - start) -  split_List[cursplit]["PB Run"];
        delta = (now - start) - pb;
        if(run_delta == null && delta_time > -10000) {
            split_delta.innerHTML = renderDeltaTime(delta_time);
            colorGenSimple(split_delta);
        }
        else if(delta_time > -10000 || delta_time > run_delta) {
            split_delta.innerHTML = renderDeltaTime(delta_time);
            colorGen(split_delta);
        }
        var html = '<div class="total-time">' 
            + renderTime(start, now) 
            + '</div>';
        display.innerHTML = html;
        
    }

    interval = setInterval(tick, 10);
    split_delta = document.getElementById(`d0`);
    split_timer =  document.getElementById(`id0`);
}

function stopStopwatch() {
    if(interval) {
        clearInterval(interval);

        interval = null;
    }
}

function splitTime() {
    if(interval) {
        var now = new Date();
        var local_splittime = renderSplitTime(start, now);
        split_timer.innerHTML = local_splittime;
        split_delta.innerHTML = renderDeltaTime(delta_time);
        colorGen(split_delta);
        previous_time.innerHTML = renderDeltaTime(delta_time - run_delta);
        colorGenSimple(previous_time);
        split_List[cursplit]["Current Run"] = (now - start);
        split_List[cursplit]["Delta"] = delta_time;
        if(cursplit == L - 1) {
            endSplit()
            return;
        }
        

        cursplit++;
        run_delta = delta_time;
        pb = pb + split_List[cursplit]["PB Run"];
        
        if(cursplit != L - 1) {
            split_delta = document.getElementById(`d${cursplit}`);
            split_timer =  document.getElementById(`id${cursplit}`);
        }
        else
        {
            split_delta = final_split_delta;
            split_timer = final_split_time;          
        }

        split = now;
    }
}

function endSplit() {
    stopStopwatch();
    if(split_List[cursplit]["Current Run"] < split_List[cursplit]["PB_Run"] || split_List[cursplit]["PB Run"] == null) {
        for(var x = 0; x < L; x++) { 
            split_List[x]["PB Run"] = split_List[x]["Current Run"];
        }
    }
    split_List["DAT"]["Pulls"]++;
    DAT_pulls = split_List["DAT"]["Pulls"];

    console.log(split_List);
}

function colorGenSimple(e) {
    if(split_List[cursplit]["PB Run"] == null) {
        return;
    }
    if((delta_time - run_delta) <= 0) {
        e.setAttribute('style', 'color:#29CC54');
    }
    else {
        e.setAttribute('style', 'color:#CC3729');
    }
}

function colorGen(e) {
    if(split_List[cursplit]["PB Run"] == null) {
        return;
    }
    if(delta_time < 0) {
        if(delta_time > run_delta) {
            e.setAttribute('style', 'color:#70CC89');
        }
        else {
            e.setAttribute('style', 'color:#29CC54');
        }
    }
    else {
        if(delta_time < run_delta) {
            e.setAttribute('style', 'color:#CC7870');
        }
        else {
            e.setAttribute('style', 'color:#CC3729');
        }
    }
}

function calculatePeriod(t1, t2) {
    var dt = t2 - t1;

    var units = [
        {name: 'milliseconds', scale: 1000},
        {name: 'seconds', scale: 60},
        {name: 'minutes', scale: 60},
        {name: 'hours', scale: 24}
    ];

    var result = { };

    for(var i = 0; i < units.length; ++i) {
        var unit = units[i];

        var total = Math.floor(dt / unit.scale);
        var rest = dt - total * unit.scale;

        result[unit.name] = rest;

        dt = total;
    }

    result.days = dt;

    return result;
}

function padLeft(number, length, character) {
    if(character == null)
        character = '0';

    var result = number.toString();

    for(var i = result.length; i < length; ++i) {
        result = character + result;
    }

    return result;
}

function renderTime(t1, t2) {
    var period = calculatePeriod(t1, t2);
    var text = '';

    if (period.hours) {
        text += period.hours + ':'
        text += padLeft(period.minutes, 2) + ':';
        text += padLeft(period.seconds, 2) + '.';
        text += padLeft(Math.floor(period.milliseconds / 10), 2);
        return text;
    }
    if (period.minutes) {
        text += period.minutes + ':';
        text += padLeft(period.seconds, 2) + '.';
        text += padLeft(Math.floor(period.milliseconds / 10), 2);
        return text;
    }   

    text += period.seconds + '.';
    text += padLeft(Math.floor(period.milliseconds / 10), 2);
    return text;
}

function renderSplitTime(t1, t2) {
    var period = calculatePeriod(t1, t2);
    var text = '';

    if (period.hours) {
        text += padLeft(period.hours, 2) + ':';
        text += padLeft(period.minutes, 2); 
    }
    else {
        text += period.minutes 
    }
     
    text += ':' + padLeft(period.seconds, 2)

    return text;
}

function renderDeltaTime(t) {
    if(t < 0) {
        var text = "-"
        t = t * -1;
    }
    else {
        var text = ""
    }
    var seconds = parseInt(t / 1000);
    var hours = parseInt(seconds / 3600);
    var minutes = parseInt(seconds/ 60);
    seconds = parseInt(seconds % 60);
    
    if(hours) {
        text += hours + ':'
        text += padLeft(minutes, 2) + ':';
        text += padLeft(seconds, 2);
        return text;
    }
    if(minutes) {
        text += minutes + ':';
        text += padLeft(seconds, 2);
        return text;
    }

    text += seconds + '.' + Math.round(t % 1000 / 100) % 10;
    return text;
}

function toTime(t) {
    var text = "";
    var seconds = t / 1000;
    var hours = parseInt(seconds / 3600);
    var minutes = parseInt(seconds/ 60);
    seconds = parseInt(seconds % 60);
    
    if(hours) {
        text += hours + ':'
        text += padLeft(minutes, 2) + ':';
        text += padLeft(seconds, 2);
    }
    else {
        text += minutes + ':'
        text += padLeft(seconds, 2);
    }
    return text;
}