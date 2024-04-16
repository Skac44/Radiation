import { format } from 'date-fns';


    async function fetchRad(){
        try {
            const response = await fetch(`https://services.arcgis.com/hXMee8yFWcVs2IH0/ArcGIS/rest/services/RADIS_EURDEP1_dash_view/FeatureServer/0/query?where=loc_name=%27Visaginas_vta_21074%27&outFields=Value&f=json&returnGeometry=false`);
            if(!response.ok){
                throw new Error("Resource not found");
            }
            const data = await response.json();
            const radNum = data.features[0].attributes.VALUE;
            const txtElement = document.getElementById("radiation");

            txtElement.innerHTML = radNum;

            if(radNum > 300){txtElement.style.color = "rgb(232, 252, 3)";}else {txtElement.style.color = "rgb(14, 227, 7)";} 
        }
        catch(error){
            console.error("failed", error)
        }
    }



    async function fetchTimeseries(){
        try {
            const d = new(Date);
            d.setHours(d.getHours() - 27);
            const dateFrom = format(d, 'yyyy-MM-dd HH:mm:ss');
    
            const d1 = new(Date);
            const dateTo = format(d1, 'yyyy-MM-dd HH:mm:ss');
    
            // const dateFrom = `2024-03-13 16:59:59`;
            // const dateTo = `2024-03-14 17:00:00`;
            const response = await fetch(`https://services.arcgis.com/hXMee8yFWcVs2IH0/arcgis/rest/services/RADIS_EURDEPSTAT_csvview/FeatureServer/0/query?f=json&groupByFieldsForStatistics=EXTRACT(YEAR%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)%2CEXTRACT(MONTH%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)%2CEXTRACT(DAY%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)%2CEXTRACT(HOUR%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)&outFields=OBJECTID%2CVALUE%2CTIMESTAMP&outStatistics=%5B%7B%22onStatisticField%22%3A%22VALUE%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22avg%22%7D%5D&resultType=standard&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=(TIMESTAMP%20BETWEEN%20timestamp%20%27` + encodeURIComponent(dateFrom) + `%27%20AND%20timestamp%20%27` + encodeURIComponent(dateTo) + `%27%20AND%20TIMESTAMP%3C%3D(CURRENT_TIMESTAMP%20-%20INTERVAL%20%271%27%20HOUR))%20AND%20(LOC_CODE%3D%27%5CLT21074%27)`);
            if(!response.ok){
                throw new Error("Resource not found");
            }
            const data = await response.json();

            // console.log(data);           //debug
            // console.log(dateFrom);
            // console.log(dateTo);
            // const testNum = data.features[0].attributes.value;

            const rows = [['Time', 'Value']];
            for (let i = 0; i < data.features.length; i++) {
                const radValue = data.features[i].attributes.value;
        //        const formattedDate = `${data.features[i].attributes.EXPR_2.toString().padStart(2, '0')}-${data.features[i].attributes.EXPR_3.toString().padStart(2, '0')} ${data.features[i].attributes.EXPR_4.toString().padStart(2, '0')}:00`; //nesimato
                const formattedDate = ` ${data.features[i].attributes.EXPR_4.toString().padStart(2, '0')}h`;
                rows.push([formattedDate, parseFloat(radValue.toFixed(1))]);
              }
            // console.log(rows);           //debug
            // console.log(testNum);
            return rows;
        }
        catch(error){
            console.error("failed", error);
            return [];
        }
    }


    //google charts

    google.charts.load('current', {'packages':['corechart']});
    google.charts.setOnLoadCallback(drawChart);

    function drawChart(data) {
        var chartData = google.visualization.arrayToDataTable(data);

        var options = {
          title: 'Pastarosios paros vertės:',
          hAxis: {title: 'Laikas',  titleTextStyle: {color: '#333'}, textStyle: {fontSize: 17}},
          vAxis: {title: 'nSv/h'},
          colors: ['#2A3995'],
          backgroundColor: '#e7e6e2',
          legend: 'none'
        };

        var range = chartData.getColumnRange(1);
  
        options.vAxis.minValue = range.min;
        options.vAxis.maxValue = range.max;

        var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
        chart.draw(chartData, options);
      }

      function rotation(){

        const AEBackground = document.getElementById("bckr");
        const BusBackground = document.getElementById("bckrBus");
        const RdInfo = document.getElementById("RadInfo");
        const TimeTable = document.getElementById("tvrk");
        const Map = document.getElementById("map");


        if (RdInfo.style.display !== 'none') {
            RdInfo.style.display = 'none'; // Hide radiation container
            TimeTable.style.display = 'block';  // Show picture container
            AEBackground.style.display = 'none'; // Hide rad background
            BusBackground.style.display = 'block'; // Show bus background 
          } 
          else if(TimeTable.style.display !== 'none'){
            TimeTable.style.display = 'none'; // Hide picture container
            Map.style.display = 'block';  // Show picture container
            AEBackground.style.display = 'none'; // Hide rad background
            BusBackground.style.display = 'block'; // Show bus background 
          }
          else{
            RdInfo.style.display = 'block'; // Hide radiation container
            Map.style.display = 'none';  // Hide picture container
            TimeTable.style.display = 'none';  // Hide picture container
            AEBackground.style.display = 'block'; // Show rad background
            BusBackground.style.display = 'none'; // Hide bus background 
          }

      }


      setTimeout(function(){
        window.location.reload();
     }, 1000*60*60*24);

    fetchTimeseries().then(data => drawChart(data));
    setInterval(() => {fetchTimeseries().then(data => drawChart(data));}, 1000*60*60);

    fetchRad();
    setInterval(fetchRad, 1000*60*60);

    setInterval(() => {
        rotation();
      }, 10000);

   // document.getElementById("RadInfo").style.visibility = "hidden";
    console.log("shoutout to Devidq: https://github.com/holmraven");