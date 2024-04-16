import { format } from 'date-fns';

async function fetchTimeseries(){
    try {
        const d = new(Date);
        const dateFrom = format(d, 'yyyy-MM-dd HH:mm:ss');

        const d1 = new(Date);
        d1.setHours(d1.getHours() - 24);
        const dateTo = format(d1, 'yyyy-MM-dd HH:mm:ss');

        // const dateFrom = `2024-03-13 16:59:59`;
        // const dateTo = `2024-03-14 17:00:00`;
        const response = await fetch(`https://services.arcgis.com/hXMee8yFWcVs2IH0/arcgis/rest/services/RADIS_EURDEPSTAT_csvview/FeatureServer/0/query?f=json&groupByFieldsForStatistics=EXTRACT(YEAR%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)%2CEXTRACT(MONTH%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)%2CEXTRACT(DAY%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)%2CEXTRACT(HOUR%20FROM%20TIMESTAMP%20%2BINTERVAL%20%272%3A00%3A01%27%20HOUR%20TO%20SECOND)&outFields=OBJECTID%2CVALUE%2CTIMESTAMP&outStatistics=%5B%7B%22onStatisticField%22%3A%22VALUE%22%2C%22outStatisticFieldName%22%3A%22value%22%2C%22statisticType%22%3A%22avg%22%7D%5D&resultType=standard&returnGeometry=false&spatialRel=esriSpatialRelIntersects&where=(TIMESTAMP%20BETWEEN%20timestamp%20%27` + encodeURIComponent(dateFrom) + `%27%20AND%20timestamp%20%27` + encodeURIComponent(dateTo) + `%27%20AND%20TIMESTAMP%3C%3D(CURRENT_TIMESTAMP%20-%20INTERVAL%20%271%27%20HOUR))%20AND%20(LOC_CODE%3D%27%5CLT21074%27)`);
        if(!response.ok){
            throw new Error("Resource not found");
        }
        const data = await response.json();
        console.log(data);
        console.log(dateFrom);
        console.log(dateTo);
        // const radNum = data.features[0].attributes.VALUE;
        // const txtElement = document.getElementById("radiation");

        // txtElement.innerHTML = radNum;

        // if(radNum > 300){txtElement.style.color = "rgb(232, 252, 3)";}else {txtElement.style.color = "rgb(14, 227, 7)";} 
    }
    catch(error){
        console.error("failed", error)
    }
}

fetchTimeseries();
//setInterval(fetchTimeseries, 3.6e+6);