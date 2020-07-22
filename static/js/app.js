Main();

function Main() {
    var selector = d3.select("#selDataset");
    
    d3.json("/samples.json").then((sampleNames) => {
      sampleNames.names.forEach((sample) => {
        selector
          .append("option")
          .text(sample)
          .property("value", sample);
      });
  
      const firstSample = sampleNames.names[0];
      console.log(firstSample)
      buildCharts(firstSample);
      buildMetadata(firstSample);
    });
  }
  
  function optionChanged(newSample) {
    // Fetch new data each time a new sample is elected
    buildCharts(newSample);
    buildMetadata(newSample);
  }


function buildMetadata(sample) {
    // Using `d3.json` to fetch the metadata for a sample
    // console.log(sample)
    d3.json("/samples.json").then(function(sampleData) {
      Data_name = sampleData.metadata;
      
      // Using d3 to select the panel with id of `#sample-metadata`
      var PANEL = d3.select("#sample-metadata");
      
      // Using `.html("") to clear any existing metadata
      PANEL.html("");

      Data_name.forEach(data => {
          if(data.id == sample){
            PANEL.append('h6').text('Age: '+data.age);
            PANEL.append('h6').text('BBType: '+data.bbtype);
            PANEL.append('h6').text('Ethnicity: '+data.ethnicity);
            PANEL.append('h6').text('Gender: '+data.gender);
            PANEL.append('h6').text('Location: '+data.location);
            PANEL.append('h6').text('Sample ID: '+data.id);
          }
      })
      })
    }
    


function buildCharts(sample) {
  d3.json("/samples.json").then(function (sampleData) {
    Data = sampleData.samples;

    //onsole.log(Data)

    var otu_ids;
    var  otu_labels;
    var sample_values;

    Data.forEach(data =>{
      if(data.id == sample){
        const otu_ids = data.otu_ids;
        const otu_labels = data.otu_labels;
        const sample_values = data.sample_values;

        // console.log(otu_ids)

              //Building Bubble chart
        var pieData = [{
          values:sample_values.splice(0, 10),
          labels: otu_ids.splice(0, 10),
          hovertext: otu_labels.splice(0, 10),
          hoverinfo: 'hovertext',
          type: 'pie'
        }];

        var bubbleData = [{
          x: otu_ids,
          y: sample_values,
          text: otu_labels,
          mode: 'markers',
          marker: {
            size: sample_values,
            color: otu_ids,
            colorscale: 'Earth'
          }
        }];      
  
        var bubbleLayout = {
          margin: { t: 0 },
          hovermode: 'closest',
          xaxis: {title: 'OTU ID'},
        };
  
        Plotly.plot('bubble', bubbleData, bubbleLayout);

        var pieLayout = {
          margin: {t: 0, l: 0}
        }

        Plotly.plot('pie', pieData, pieLayout);
        }

        })
      
    
  })

}

