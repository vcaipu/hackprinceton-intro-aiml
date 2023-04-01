var fs = require("fs");
var fsPromises = fs.promises;
const jsStats = require('js-stats');
const mathjs = require('mathjs');

function generateLine(homeStatLines,awayStatLines){
    var res = [];
    var counter = 0;
    awayStatLines.forEach(line=>{
        var arr = line.split(",");
        var rand = Math.random();

        //create
        var dataSet = [];
        for(var i = 2;i<arr.length;i++) dataSet.push(arr[i]);
        var stddev = mathjs.std(dataSet);
        var mean = mathjs.mean(dataSet);
        var tDist = new jsStats.TDistribution(dataSet.length);
        var t_df = tDist.invCumulativeProbability(rand);
        var r = mean + stddev * t_df;

        //put into array
        res[counter] = r;
        counter += 2;
    })

    counter = 1;
    homeStatLines.forEach(line=>{
        var arr = line.split(",");
        var rand = Math.random();

        //create
        var dataSet = [];
        for(var i = 2;i<arr.length;i++) dataSet.push(arr[i]);
        var stddev = mathjs.std(dataSet);
        var mean = mathjs.mean(dataSet);

        var tDist = new jsStats.TDistribution(dataSet.length);
        var t_df = tDist.invCumulativeProbability(rand);
        var r = mean + stddev * t_df;

        //put into array
        res[counter] = r;
        counter += 2;
    })

    var finalLine = ""
    res.forEach(r=>finalLine += (r<0 ? 0 : r).toFixed(1) + ',');
    finalLine = finalLine.substring(0,finalLine.length-1)
    finalLine += "\n";
    return finalLine;
}

async function randomizeTest(awayTeam,homeTeam,count){

    var data = await fsPromises.readFile("GeneratingData.csv","utf-8");
    var dataLines = data.split("\n");
    var homeStatLines = dataLines.filter(d=>d.includes(homeTeam));
    var awayStatLines = dataLines.filter(d=>d.includes(awayTeam));

    var fileContents = "1st Downs (AWAY),1st Downs (HOME),3rd down efficiency (AWAY),3rd down efficiency (HOME),4th down efficiency (AWAY),4th down efficiency (HOME),Total Plays (AWAY),Total Plays (HOME),Total Yards (AWAY),Total Yards (HOME),Total Drives (AWAY),Total Drives (HOME),Yards per Play (AWAY),Yards per Play (HOME),Passing (AWAY),Passing (HOME),Comp-Att (AWAY),Comp-Att (HOME),Yards per pass (AWAY),Yards per pass (HOME),Sacks-Yards Lost (AWAY),Sacks-Yards Lost (HOME),Rushing (AWAY),Rushing (HOME),Rushing Attempts (AWAY),Rushing Attempts (HOME),Yards per rush (AWAY),Yards per rush (HOME),Red Zone (Made-Att) (AWAY),Red Zone (Made-Att) (HOME),Penalties (AWAY),Penalties (HOME),Turnovers (AWAY),Turnovers (HOME),Defensive / Special Teams TDs (AWAY),Defensive / Special Teams TDs (HOME),Possession (AWAY),Possession (HOME)\n";

    for(var i = 0;i<count;i++){
        
        var l = generateLine(homeStatLines,awayStatLines);
        fileContents += l;
        console.log((i + 1) + " Data Points Generated");
    }

    fileContents = fileContents.substring(0,fileContents.length-1); // remove newline character at end;

    const fileName = "results/"+awayTeam+"-at-"+homeTeam+".csv";
    await fsPromises.writeFile(fileName,fileContents);
    console.log("************")
    console.log("SUCCESSFULLY WRITTEN DATA IN FILE \""+fileName+ "\"")
}


/*** Generate random game data ***/
/** Ex: Philadelphia at Kansas City, 100 samples */
randomizeTest("PHI","KC",100);