// Compute NDVI 3 ways.
var landsat = ee.ImageCollection("LANDSAT/LC08/C01/T1")
    .filterDate('2019-01-01', '2020-01-01')
    .filterBounds(geometry)

var composite = ee.Algorithms.Landsat.simpleComposite({
  collection: landsat,
  asFloat: true
})

// Method 1)
var b5 = composite.select("B5")
var b4 = composite.select("B4")
var ndvi_1 = b5.subtract(b4).divide(b5.add(b4))

// Method 2)
var ndvi_2 = composite.normalizedDifference(["B5", "B4"])

// Method 3)
var ndvi_3 = composite.expression("(b5 - b4) / (b5 + b4)", {
    b5: composite.select("B5"),
    b4: composite.select("B4")
})

var dif = ndvi_1.subtract(ndvi_2)

Map.addLayer(ndvi_1, {min:-0.2, max:0.8} , "NDVI")

var cent = geometry2.centroid()
Map.addLayer(cent, {color:'blue', width:5} , "Centroide")


//Map.addLayer(dif, {min:-0.2, max:0.2} , "NDVI DIFF")

Map.centerObject(geometry, 10) 

// Calculate Modified Normalized Difference Water Index (MNDWI)
// 'GREEN' (B3) and 'SWIR1' (B11)
var mndwi = composite.normalizedDifference(['B3', 'B6']).rename(['mndwi']); 

// Calculate Soil-adjusted Vegetation Index (SAVI)
// 1.5 * ((NIR - RED) / (NIR + RED + 0.5))

// For more complex indices, you can use the expression() function
var savi = composite.expression(
    '1.5 * ((NIR - RED) / (NIR + RED + 0.5))', {
      'NIR': composite.select('B5'),
      'RED': composite.select('B4'),
}).rename('savi');

//var rgbVis = {min: 0.0, max: 350, bands: ['B5', 'B4', 'B3']};
var ndviVis = {min:0, max:1, palette: ['white', 'green']}
var ndwiVis = {min:0, max:0.5, palette: ['white', 'blue']}

Map.addLayer(mndwi, ndwiVis, 'mndwi')
Map.addLayer(savi, ndviVis, 'savi') 