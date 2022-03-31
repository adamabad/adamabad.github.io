var interval = null; // interval id
var start = null; // start time
var split = null; // split time
var cursplit = 0;

var display = document.getElementById('display');
var times = document.getElementById('times');
var table = document.getElementById('times');
var split_element = [];

var dungeon_splits = [
    ["", "Pack 1", "", "1:40"], 
    ["", "Boss 1", "", "3:10"], 
    ["", "Pack 2 - 3", "", "4:53"], 
    ["", "Boss 2", "", "6:45"],
    ["", "Pack 4 - 5", "", "8:56"],
    ["", "Boss 3", "", "11:01"]
]
var L = dungeon_splits.length;

window.onload = () => {
    
    for(x = 0; x < (L - 1); x++) {
        let element = dungeon_splits[x];
        var localArray = [];
        table.innerHTML += `<div class="table_row">`
        + ` <div class="split_img"><img src=${element[0]}></img></div>`
        + ` <div class="split_title">${element[1]}</div>`
        + ` <div class="split_delta" id="d${x}" data-value="">${element[2]}</div>`
        + ` <div class="split_time" id="id${x}">${element[3]}</div>`
        + `</div>`
        split_element[x] = [document.getElementById(`d${x}`), document.getElementById(`id${x}`)];
    }
    document.getElementById('final_split_img').setAttribute('src', dungeon_splits[L - 1][0]);
    document.getElementById('final_split_title').innerHTML = dungeon_splits[L - 1][1];
    document.getElementById('final_split_delta').innerHTML = dungeon_splits[L - 1][2];
    document.getElementById('final_split_time').innerHTML = dungeon_splits[L - 1][3];

    console.log(split_element);
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

    if(split) {
        times.style.display = 'none';
        times.innerHTML = '';
    
        split = null;
    }

    function tick() {
        var now = new Date();
        
        if(split) {
            var html = '<div class="total-time">' 
                + renderTime(start, now) 
                + '</div>'
                + '<div class="split-time">' 
                + renderTime(split, now)
                + '</div>';
        
            display.innerHTML = html;
        } else {
            var html = '<div class="total-time">' 
                + renderTime(start, now) 
                + '</div>';
        
            display.innerHTML = html;
        }
    }

    interval = setInterval(tick, 10);
}

function stopStopwatch() {
    if(interval) {
        clearInterval(interval);

        interval = null;
    }
}

function splitTime() {
    
    
    if(cursplit == L - 1) {
        stopStopwatch();
    }
    if(interval) {
        var now = new Date();
        
        split_element[cursplit][1].innerHTML = "0";
        //split_element[cursplit][1].innerHTML = renderTime(start, now);
        // if (split == null) {
        //     times.innerHTML += '<div class="split-time">' 
        //         + renderTime(start, now)
        //         + '</div>';
        
        //     times.style.display = 'block';
        // } else {
        //     times.innerHTML += '<div class="split-time">' 
        //         + renderTime(split, now)
        //         + '</div>';
        // }
        cursplit++;
        split = now;
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
        text += padLeft(period.hours, 2) + ':';
    }
    if (period.minutes) {
        text += padLeft(period.minutes, 2) + ':';
    }   
    text += padLeft(period.seconds, 2) + '.';
    text += padLeft(Math.floor(period.milliseconds / 10), 2);

    return text;
}