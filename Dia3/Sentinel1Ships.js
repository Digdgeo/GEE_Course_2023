//WaterMask
var dataset = ee.Image('MODIS/MOD44W/MOD44W_005_2000_02_24');
var waterMask = dataset.select('water_mask');
var land = waterMask.eq(0)
var waterMaskVis = {
  min: 0.0,
  max: 1,
};

Map.addLayer(waterMask, waterMaskVis, 'Water Mask');


// Load the Sentinel-1 ImageCollection.
var sentinel1 = ee.ImageCollection('COPERNICUS/S1_GRD');

// Filter by metadata properties.
var vh_2020 = sentinel1
  // Filter to get images with VH polarization.
  .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
  // Filter to get images collected in interferometric wide swath mode.
  .filter(ee.Filter.eq('instrumentMode', 'IW'))
  .filterDate("2021-01-01","2021-06-07");

// Filter to get images from different look angles.
var vhAscending = vh_2020.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));
var vhDescending = vh_2020.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));

var radar_2020 = vhAscending.select('VH').merge(vhDescending.select('VH')).max().mask(waterMask);


// Map composite over the Channel
Map.centerObject(geometry, 12);
Map.addLayer(radar_2020, {min: -15, max: 0}, 'Radar Merge 2020');

//LANDSAT
// Function to cloud mask from the pixel_qa band of Landsat 8 SR data.
function maskL8sr(image) {
  // Bits 3 and 5 are cloud shadow and cloud, respectively.
  var cloudShadowBitMask = 1 << 3;
  var cloudsBitMask = 1 << 5;

  // Get the pixel QA band.
  var qa = image.select('pixel_qa');

  // Both flags should be set to zero, indicating clear conditions.
  var mask = qa.bitwiseAnd(cloudShadowBitMask).eq(0)
      .and(qa.bitwiseAnd(cloudsBitMask).eq(0));

  // Return the masked image, scaled to reflectance, without the QA bands.
  return image.updateMask(mask)//.divide(10000)
      .select("B[0-9]*")
      .copyProperties(image, ["system:time_start"]);
}


// Map the function over one year of data.
var collection = ee.ImageCollection('LANDSAT/LC08/C01/T1_SR')
    .filterDate('2021-01-01', '2021-12-31')
    .map(maskL8sr)

var composite = collection.median().mask(land);

// Display the results.

// Make a handy variable of visualization parameters.
var visParams = {bands: ['B6', 'B5', 'B4'], min: 100, max: 3500};

Map.addLayer(composite, visParams, 'Landsat')

print('Webs')