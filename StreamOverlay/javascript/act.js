var bossName = "";
var maxHP = -1;
var currentBest = 100;
var timerActive = false;
var isDungeon = true;
var willSealed = /^.* will be sealed off in 15 seconds\!.*$/;
var noSealed = /^.* is no longer sealed\!.*$/;
var hasbegun = /^.* has begun\..*$/;
addOverlayListener("LogLine", (e) => ingestLine(e));
addOverlayListener("CombatData", (e) => checkCombat(e));
//addOverlayListener("ChangeZone", (e) => loadZone(e));
startOverlayEvents();

function ingestLine(data) 
{
    switch(data.line[0]) 
    {
        case "37":
            if(bossName == "" || data.line[3] != bossName)
            {
                return;
            }
            var value = (data.line[5] / maxHP * 100).toFixed(2).toString();
            
            if(value < currentBest)
            {
                currentBest = value;
            }
            
            updateBar(value, currentBest);
            if(value == 0 && !isDungeon) 
            {
                stopStopwatch();
            }
            break;
        case "38":
            if(data.line[6] < 1000000)
                return;
            bossName = data.line[3].toString();        
            maxHP = data.line[6];
            document.getElementById('bar-Header').innerHTML = bossName;
            break;
        case "00":
            switch(true) 
            {
                case willSealed.test(data.line):
                    splitTime();
                    break;
                case noSealed.test(data.line):
                    splitTime();
                    break;
                case hasbegun.test(data.line):
                    if(isDungeon) 
                    {
                        startStopwatch();
                    }
                    break;
            }
    }   
}

function checkCombat(data) 
{

    if(data.isActive == "false") 
    {
        timerActive = false;
        stopStopwatch();
        return;
    }
    else if(!timerActive)
    {
        timerActive = true;
        startStopwatch();
    }

}