var roi = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-5.604367871093749, 36.86432572667367],
          [-5.604367871093749, 36.58694890472637],
          [-5.181394238281249, 36.58694890472637],
          [-5.181394238281249, 36.86432572667367]]], null, false),
    andalucia = ee.FeatureCollection("users/digdgeografo/curso_GEE/Andalucia");


//cargamos el datset como variable
var dataset = ee.Image('CGIAR/SRTM90_V4');

//seleccionamos la banda 'elevation'
var elevation = dataset.select('elevation');

//usamos las herramientas slope y aspect de la api disponibles en ee.Terrain (buscar en Docs)
var slope = ee.Terrain.slope(elevation);
var aspect = ee.Terrain.aspect(elevation);

//creamos una imagen compuesta con las 3 variables
var full = ee.Image.cat([elevation, slope, aspect]);

//Añadimos el mapa y cargamos los rasters con su visualización. Cuidado de cargar la capa que es y cambiar los máximos y mínimos
Map.setCenter(-5.8598, 36.8841, 10);
//Map.addLayer(elevation, {min: 0, max: 3000, palette: ['green', 'yellow', 'orange', 'brown', 'white']}, 'elevation');
//Map.addLayer(slope, {min: 0, max: 45, palette: ['white', 'red']}, 'slope');
//Map.addLayer(aspect, {min: 0, max: 360, palette: ['yellow', 'red', 'green', 'purple']}, 'aspect');
Map.addLayer(full, {min: 0, max:40, bands:['slope'], palette:['white', 'red']}, 'full_terrain');


//ESTADISTICAS ZONALES A UN ROI
var roiStats = full.reduceRegion({
  reducer: ee.Reducer.max(),
  geometry: roi,
  scale: 90,
  maxPixels: 1e9
});
print(roiStats)


//Estadisticas zonales a un municipio
var Almonte = andalucia.filter("nombre == 'Almonte'");
Map.addLayer(Almonte, {color: 'green'}, 'Almonte');

var AlmonteStats = full.select(['elevation', 'slope']).reduceRegion({
  reducer: ee.Reducer.median(),
  geometry: Almonte,
  scale: 90,
  maxPixels: 1e9
});
print('one', AlmonteStats);


//Estadísticas zonales a la selección
var filtro = ee.Filter.inList('nombre', ['Almonte', 'Monachil', 'Cazorla']);
var munis = andalucia.filter(filtro);
Map.addLayer(munis, {color: 'purple'}, 'Municipios selected');

var selStats = full.reduceRegions({
    collection: munis.select(['nombre']),
    reducer: ee.Reducer.mean(),
    scale: 30})
    
print('Seleccion', selStats);

var empty = ee.Image().byte();
// Paint all the polygon edges with the same number and width, display.
var outline = empty.paint({
  featureCollection: andalucia,
  //color: 5,
  width: 2
});
Map.addLayer(outline, {palette: 'black'}, 'edges');

//Map.addLayer(andalucia.draw({color: '006600', strokeWidth: 5}), {}, 'drawn')
// Export the image sample feature collection to Drive as a shapefile.
/*
Export.table.toDrive({
  collection: selStats,
  description: 'Andalucia',
  folder: 'GEE_CSIC_2022',
  fileFormat: 'CSV'
});
*/