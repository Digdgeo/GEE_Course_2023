
//script para calcular estadísticas zonales a un dtm

//cargamos el datset como variable
var dataset = ee.Image('CGIAR/SRTM90_V4');

//seleccionamos la banda 'elevation'
var elevation = dataset.select('elevation');

//usamos las herramientas slope y aspect de la api disponibles en ee.Terrain (buscar en Docs)
var slope = ee.Terrain.slope(elevation);
var aspect = ee.Terrain.aspect(elevation);

//creamos la variable para la visualizacion
var imageVisParam = {"opacity":1,"bands":["B5"],"min":-0.2,"max":0.8,"palette":["ffed1b","1fff50","09760c"]};

//Añadimos el mapa y cargamos los rasters con su visualización. Cuidado de cargar la capa que es y cambiar los máximos y mínimos
Map.setCenter(-5.8598, 36.8841, 10);
Map.addLayer(elevation, {min: 0, max: 3000, palette: ['green', 'yellow', 'orange', 'brown', 'white']}, 'elevation');
Map.addLayer(slope, {min: 0, max: 45, palette: ['white', 'red']}, 'slope');
Map.addLayer(aspect, {min: 0, max: 360, palette: ['yellow', 'red', 'green', 'purple']}, 'aspect');

// Compute NDVI 3 ways.
var landsat = ee.ImageCollection("LANDSAT/LC08/C01/T1")
    .filterDate('2019-01-01', '2020-01-01')
    //.filterBounds(geometry)

var composite = ee.Algorithms.Landsat.simpleComposite({
  collection: landsat,
  asFloat: true
})

// Method 1)
var b5 = composite.select("B5")
var b4 = composite.select("B4")
var ndvi_1 = b5.subtract(b4).divide(b5.add(b4))

Map.addLayer(ndvi_1, {min:-0.2, max:0.8} , "NDVI")

var mask = elevation.gt(1500).and(elevation.lt(2500));
var ndvi_masked = ndvi_1.mask(mask);
//enmascaramos el propio NDVI dejando solo los valores por encima de 0.4
var ndvi_masked_masked = ndvi_masked.updateMask(ndvi_masked.gt(0.4));

Map.addLayer(ndvi_masked, {min:-0.2, max:0.8} , "NDVI 1500")
Map.addLayer(ndvi_masked_masked, {min:0.4, max:0.8} , "NDVI 1500 Healthy")
