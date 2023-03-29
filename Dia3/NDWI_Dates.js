// Acordaros de que hay que crear la geometría con la zona que queremos y también hará falta definirle la visualización

//test l8 newCLOUDMask
 function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = (1 << 3);
  var cloudsBitMask = (1 << 5);
  // Get the pixel QA band.
  var qa = image.select('pixel_qa');
  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
                 .and(qa.bitwiseAnd(cloudsBitMask).eq(0));
  return image.updateMask(mask);
}


// Load Landsatcollections
var l5 = ee.ImageCollection('LANDSAT/LT05/C01/T1_SR')
  .select(['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'pixel_qa'], ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'pixel_qa'])
  //.rename(['B2', 'B3', 'B4', 'B5', 'B6', 'B7'])
  .filter(ee.Filter.or(
    ee.Filter.and(ee.Filter.eq('WRS_PATH', 202),         
                  ee.Filter.eq('WRS_ROW', 34))))

var l7 = ee.ImageCollection('LANDSAT/LE07/C01/T1_SR')
.select(['B1', 'B2', 'B3', 'B4', 'B5', 'B7', 'pixel_qa'], ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'pixel_qa'])
  .filter(ee.Filter.or(
      ee.Filter.and(ee.Filter.eq('WRS_PATH', 202),         
                    ee.Filter.eq('WRS_ROW', 34))))
      
                  
var l8 = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'pixel_qa'])
  .filter(ee.Filter.or(
      ee.Filter.and(ee.Filter.eq('WRS_PATH', 202),         
                    ee.Filter.eq('WRS_ROW', 34))))
     

// NDWI
function ndwi(image) {
  return image.select().addBands(image.normalizedDifference(['B3', 'B5']))
}

var merge = l8.merge(l7).merge(l5)
  .map(maskL8sr)
  .map(ndwi)
  .map(function(image){return image.clip(geometry)});


// PERIODO 1 1984-1994
var merge_p1 = merge
    .filterDate('1984-01-01', '2000-12-31')

print(merge_p1.size())
//var maxp1 = merge.reduce(ee.Reducer.percentile([95]))
var maxp1 = merge_p1.max()
//var ndwiSum = merge.reduce(ee.Reducer.sum())
var ndwiMaskedp1 = maxp1.updateMask(maxp1.gte(0.05))
 
//Map.addLayer(maxp1, {}, 'Max')
//Map.addLayer(ndwiSum, {}, 'NDWI Sum')
//Map.addLayer(ndwiMaskedp1, imageVisParam, 'NDWI Masked P1')


//PERIODO 2 1995-2005
var merge_p2 = merge
    .filterDate('2001-01-01', '2011-12-31')

print(merge_p2.size())
//var maxp2 = merge.reduce(ee.Reducer.percentile([95]))
var maxp2 = merge_p2.max()
//var ndwiSum = merge.reduce(ee.Reducer.sum())
var ndwiMaskedp2 = maxp2.updateMask(maxp2.gte(0.05))

//Map.addLayer(ndwiMaskedp2, imageVisParam, 'NDWI Masked P2')


//PERIODO 3 2005-2015
var merge_p3 = merge
    .filterDate('2012-01-01', '2022-12-31')

print(merge_p3.size())
//var maxp3 = merge.reduce(ee.Reducer.percentile([95]))
var maxp3 = merge_p3.max()
//var ndwiSum = merge.reduce(ee.Reducer.sum())
var ndwiMaskedp3 = maxp3.updateMask(maxp3.gte(0.05))

//Map.addLayer(ndwiMaskedp3, imageVisParam, 'NDWI Masked P3')



//LINKED MAPS
//Creación y linkeo entre mapas
var PanelMapas = [];
//Object.keys(ComposicionesRGB).forEach(function(name) {
var Map1 = ui.Map();
Map1.add(ui.Label('PERIODO 1: 1984-2000'));
//Map1.addLayer(s2, rgbVis, 'S2 Image');
Map1.addLayer(ndwiMaskedp1, {min: 0, max: 0.7, palette:['FFFFFF', '0000FF']}, 'NDWI Masked P1');
Map1.setControlVisibility(false);
PanelMapas.push(Map1);

var Map2 = ui.Map();
Map2.add(ui.Label('PERIODO 2: 2001-2011'));
//Map2.addLayer(s2, rgbVis, 'S2 Image');
Map2.addLayer(ndwiMaskedp2, {min: 0, max: 0.7, palette:['FFFFFF', '0000FF']}, 'NDWI Masked P2');
Map2.setControlVisibility(false);
PanelMapas.push(Map2);

var Map3 = ui.Map();
Map3.add(ui.Label('PERIODO 3: 2012-2022'));
//Map3.addLayer(s2, rgbVis, 'S2 Image');
Map3.addLayer(ndwiMaskedp3, {min: 0, max: 0.7, palette:['FFFFFF', '0000FF']}, 'NDWI Masked P3');
Map3.setControlVisibility(false);
PanelMapas.push(Map3);
var linker = ui.Map.Linker(PanelMapas);

//Configuración de la posición de los 4 mapas sobre la vista
var mapGrid = ui.Panel([
      ui.Panel([PanelMapas[0]
], null, {stretch: 'both'}),
      ui.Panel([PanelMapas[1]], null, {stretch: 'both'}),
      ui.Panel([PanelMapas[2]], null, {stretch: 'both'}),],
      //ui.Panel([PanelMapas[3]], null, {stretch: 'both'}),],
      ui.Panel.Layout.Flow('horizontal'), {stretch: 'both'});


// Controladores de título y escala-zoom para el primer mapa
PanelMapas[0].setControlVisibility({zoomControl: true});
PanelMapas[0].setControlVisibility({scaleControl: true});
var Titulo = ui.Label('Water Mask Periods', {
  stretch: 'horizontal',
  textAlign: 'center',
  fontWeight: 'bold',
  fontSize: '15 px'});


// Centrado del mapa en localización y carga de títulos y mapas en vertical
PanelMapas[0].setCenter(-6.4695, 37.28,  10);
ui.root.widgets().reset([Titulo, mapGrid]);
ui.root.setLayout(ui.Panel.Layout.Flow('vertical'));