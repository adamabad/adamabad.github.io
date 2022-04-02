var interval = null; // interval id
var start = null; // start time
var split = null; // split time
var cursplit = 0;

var display = document.getElementById('display');
var times = document.getElementById('times');
var table = document.getElementById('times');
var previous_split_timer = document.getElementById('previous_time');
var split_delta;
var split_timer;
var run_delta = null;
var delta_time;
var pb;

var dungeon_splits = [
    ["", "Pack 1", "", 10000], 
    ["", "Boss 1", "", 19000], 
    ["", "Pack 2 - 3", "", 29400], 
    ["", "Boss 2", "", 40500],
    ["", "Pack 4 - 5", "", 53600],
    ["", "Boss 3", "", 66100]
]
var split_List = dungeon_splits;
var L = split_List.length;

window.onload = () => {
    
    for(x = 0; x < (L - 1); x++) {
        let element = split_List[x];
        let text = ""
        text += `<div class="table_row">`;
        if(element[0] != "") {
            text += ` <div class="split_img"><img src=${element[0]}/></div>`;
        }
        text += ` <div class="split_title">${element[1]}</div>`
        + ` <div class="split_time" id="id${x}">${toTime(element[3])}</div>`
        + ` <div class="split_delta" id="d${x}" data-value="">${element[2]}</div>`
        + `</div>`;
        
        table.innerHTML += text;
    }
    document.getElementById('final_split_img').setAttribute('src', split_List[L - 1][0]);
    document.getElementById('final_split_title').innerHTML = split_List[L - 1][1];
    document.getElementById('final_split_delta').innerHTML = split_List[L - 1][2];
    document.getElementById('final_split_time').innerHTML = toTime(split_List[L - 1][3]);
};

function cleanUI() {
    var elements = document.getElementsByClassName("split_delta");
    for(var x = 0; x < elements.length; x++) {
        elements[x].innerHTML = "";
        elements[x].style = "";
    }
}

function startStopwatch() {
    cursplit = 0;
    cleanUI();

    if(interval)
        return;

    start = new Date();
    split = start;
    pb = split_List[cursplit][3];
    function tick() {
        var now = new Date();
        delta_time = (now - start) -  split_List[cursplit][3];
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

        if(cursplit == L - 1) {
            stopStopwatch();
            return;
        }
        

        cursplit++;
        run_delta = delta_time;
        pb = pb + split_List[cursplit][3];
        
        if(cursplit != L - 1) {
            split_delta = document.getElementById(`d${cursplit}`);
            split_timer =  document.getElementById(`id${cursplit}`);
        }
        else
        {
            split_delta = document.getElementById(`final_split_delta`)
            split_timer = document.getElementById(`final_split_time`)           
        }

        split = now;
    }
}

function colorGenSimple(e) {
    if((delta_time - run_delta) <= 0) {
        e.setAttribute('style', 'color:#29CC54');
    }
    else {
        e.setAttribute('style', 'color:#CC3729');
    }
}

function colorGen(e) {
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
        text += padLeft(Math.round(period.milliseconds / 10), 2);
        return text;
    }
    if (period.minutes) {
        text += period.minutes + ':';
        text += padLeft(period.seconds, 2) + '.';
        text += padLeft(Math.round(period.milliseconds / 10), 2);
        return text;
    }   

    text += period.seconds + '.';
    text += padLeft(Math.round(period.milliseconds / 10), 2);
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
    var seconds = t / 1000;
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