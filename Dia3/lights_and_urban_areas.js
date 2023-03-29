
var dataset = ee.Image('JRC/GHSL/P2016/BUILT_LDSMT_GLOBE_V1');
var builtUpMultitemporal = dataset.select('built')//.clip(country);

var lights = ee.ImageCollection('NOAA/VIIRS/DNB/MONTHLY_V1/VCMSLCFG').select("avg_rad")
  .filter(ee.Filter.date('2014-01-01', '2014-12-31'));

var sum_Lights = lights.reduce(ee.Reducer.sum())//.clip(country);
var median_Lights = lights.reduce(ee.Reducer.median())//.clip(country);

var thold = median_Lights.gt(2);

var nthold = thold.mask(builtUpMultitemporal.gt(2));
var ntholdself = nthold.selfMask();

var visParams = {
  min: 3.0,
  max: 6.0,
  palette: ['white', 'black', 'black', 'black', 'black'],
};


Map.setCenter(8.9957, 45.5718, 12);
Map.addLayer(builtUpMultitemporal, visParams, 'Built-Up Multitemporal');
Map.setCenter(20.1056, 20, 3);
Map.addLayer(median_Lights, {palette: ['white', 'red']}, 'SumLights');
Map.addLayer(thold, {palette: ['white', 'blue']}, 'Threeshold');
Map.addLayer(nthold, {palette: ['red', 'green']}, 'New Threeshold');
Map.addLayer(ntholdself, {palette: ['black']}, 'New Threeshold Self Masked');