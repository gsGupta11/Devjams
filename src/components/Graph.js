import React from 'react';
import ReactDOM from 'react-dom';
import ReactFC from 'react-fusioncharts';
import FusionCharts from 'fusioncharts';
import Column2D from 'fusioncharts/fusioncharts.charts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';
import TimeSeries from "fusioncharts/fusioncharts.timeseries";
ReactFC.fcRoot(FusionCharts, TimeSeries);
const jsonify = res => res.json();
const dataFetch = fetch(
  "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/data/line-chart-with-time-axis-data.json"
).then(jsonify);
const schemaFetch = fetch(
  "https://s3.eu-central-1.amazonaws.com/fusion.store/ft/schema/line-chart-with-time-axis-schema.json"
).then(jsonify);

const dataSource = {
  chart: {},
  caption: {
    text: "sjwjhw ejwhej"
  },
  subcaption: {
    text: "nbwdbd "
  },
  yaxis: [
    {
      plot: {
        value: "Grocery Sales Value"
      },
      format: {
        prefix: "$"
      },
      title: "Sale Value"
    }
  ]
};

class Graph extends React.Component {
  constructor(props) {
    super(props);
    this.onFetchData = this.onFetchData.bind(this);
    this.state = {
      timeseriesDs: {
        type: "timeseries",
        renderAt: "container",
        width: "94%",
        height: "400",
        dataSource
      }
    };
  }

  componentDidMount() {
    this.onFetchData();
  }

  onFetchData() {
    Promise.all([dataFetch, schemaFetch]).then(res => {
      const data = res[0];
      const schema = res[1];
      const fusionTable = new FusionCharts.DataStore().createDataTable(
        data,
        schema
      );
      const timeseriesDs = Object.assign({}, this.state.timeseriesDs);
      timeseriesDs.dataSource.data = fusionTable;
      this.setState({
        timeseriesDs
      });
    });
  }

  render() {
    return (
      <div>
        {this.state.timeseriesDs.dataSource.data ? (
          <ReactFC {...this.state.timeseriesDs} />
        ) : (
          "loading"
        )}
      </div>
    );
  }
}
export default Graph;
