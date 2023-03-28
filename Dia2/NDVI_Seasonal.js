//Creamos la geometría a la zona de interes (Ejemplo Jordania Irrigation Pivots)

//Año 2016

var inv_16 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2016-01-01', '2016-03-31')
                  .select('NDVI').max();

var prim_16 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2016-04-01', '2016-06-30')
                  .select('NDVI').max();

var ver_16 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2016-07-01', '2016-09-30')
                  .select('NDVI').max();
//Año 2017

var inv_17 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2017-01-01', '2017-03-31')
                  .select('NDVI').max();

var prim_17 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2017-04-01', '2017-06-30')
                  .select('NDVI').max();

var ver_17 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2017-07-01', '2017-09-30')
                  .select('NDVI').max();
//Año 2018

var inv_18 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2018-01-01', '2018-03-31')
                  .select('NDVI').max();

var prim_18 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2018-04-01', '2018-06-30')
                  .select('NDVI').max();

var ver_18 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2018-07-01', '2018-09-30')
                  .select('NDVI').max();
//Año 2019
                  
var inv_19 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2019-01-01', '2019-03-31')
                  .select('NDVI').max();

var prim_19 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2019-04-01', '2019-06-30')
                  .select('NDVI').max();

var ver_19 = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')
                  .filterDate('2019-07-01', '2019-09-30')
                  .select('NDVI').max();


var year16 = ee.Image.cat(inv_16, prim_16, ver_16).clip(geometry_);
var year17 = ee.Image.cat(inv_17, prim_17, ver_17).clip(geometry_);
var year18 = ee.Image.cat(inv_18, prim_18, ver_18).clip(geometry_);
var year19 = ee.Image.cat(inv_19, prim_19, ver_19).clip(geometry_);

var mean = year16.reduce(ee.Reducer.mean())
var mask = mean.gt(0.25);
var year_2016_masked = year16.mask(mask);
//var collection = ee.ImageCollection(year16).merge(year17).merge(year18).merge(year19);


Map.centerObject(geometry_, 9);
Map.addLayer(year_2016_masked, {'min': 0.1, 'max': 0.7}, '2016');
//Map.addLayer(geometry, {opacity: 0.7}, 'geometria');
Map.addLayer(year17, {'min': 0.1, 'max': 0.7}, '2017');
//Map.addLayer(year18, {'min': 0.1, 'max': 0.7}, '2018');
//Map.addLayer(year19, {'min': 0.1, 'max': 0.7}, '2019');