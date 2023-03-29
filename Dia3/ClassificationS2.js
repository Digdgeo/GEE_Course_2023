
// Merge the hand-drawn features into a single FeatureCollection.
var newfc = ee.FeatureCollection('projects/ee-digdgeografo/assets/newfc') //sand.merge(greenhouse).merge(agua).merge(arrozal).merge(pinares).merge(eucaliptos);


//Creamos el stack de rasters con las bandas y con el ndvi estcional
var sentinel2_winter = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-01-01', '2020-03-31')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});
    
var sentinel2_spring = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-04-01', '2020-06-30')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});
    
var sentinel2_summer = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-07-01', '2020-09-30')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});

var sentinel2_autumn = ee.ImageCollection("COPERNICUS/S2_SR")
    .filterDate('2020-10-01', '2020-12-31')
    .map(function(image) {
  return image.select(['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12']).addBands(image.normalizedDifference(['B8', 'B4']).rename(['ndvi']))});
    
    
var ndvi_2020 = ee.Image.cat(sentinel2_winter.median(), sentinel2_spring.median(), sentinel2_summer.median(), sentinel2_autumn.median()).clip(geometry)

var vis = {min: 0, max: 0.8, palette: [
  'FFFFFF', 'CE7E45', 'FCD163', '66A000', '207401',
  '056201', '004C00', '023B01', '012E01', '011301'
]};

Map.addLayer(ndvi_2020, {min:0, max:3000, bands:['B8_2', 'B4_2', 'B3_2']}, 'Sentinel 2 composite');
Map.setCenter(-6.34497, 37.01918, 12);

// empezamos la clasificacion
// bandas a usar por el clasificador
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B8A', 'B11', 'B12', 'ndvi', 
  'B2_1', 'B3_1', 'B4_1', 'B5_1', 'B6_1', 'B7_1', 'B8_1', 'B8A_1', 'B11_1', 'B12_1', 'ndvi_1',
  'B2_2', 'B3_2', 'B4_2', 'B5_2', 'B6_2', 'B7_2', 'B8_2', 'B8A_2', 'B11_2', 'B12_2', 'ndvi_2'];
  
  
//var bands = ['ndvi', 'ndvi_1', 'ndvi_2', 'ndvi_3'];
  
//var bands4 = ['ndvi', 'ndvi_1', 'ndvi_2', 'ndvi_3']

// tomamos los valores de las bandas en los puntos
var training = ndvi_2020.select(bands).sampleRegions({
  collection: newfc, 
  properties: ['class'], 
  scale: 10
});

// Get a CART classifier and train it.
var classifier = ee.Classifier.smileCart().train({
  features: training, 
  classProperty: 'class', 
  inputProperties: bands
});

// Classify the image.
var classified = ndvi_2020.select(bands).classify(classifier);

//variable de visualizacion para las clasificaciones
var visParams = {min: 1, max: 6, palette: ['#d6b21c', '#7edeff', '#0406a8', '#4cff0a', '#193417', '#7bc25a']}

// Display the classification results.
Map.addLayer(classified, visParams, 'classification');

//Matrix de confusion

// Optionally, do some accuracy assessment.  Fist, add a column of
// random uniforms to the training dataset.
var withRandom = training.randomColumn('random');

// We want to reserve some of the data for testing, to avoid overfitting the model.
var split = 0.7;  // Roughly 70% training, 30% testing.
var trainingPartition = withRandom.filter(ee.Filter.lt('random', split));
var testingPartition = withRandom.filter(ee.Filter.gte('random', split));

// Trained with 70% of our data.
var trainedClassifier = ee.Classifier.smileCart().train({
  features: trainingPartition,
  classProperty: 'class',
  inputProperties: bands
});
var classified2 = ndvi_2020.classify(trainedClassifier);
Map.addLayer(classified2, visParams, 'class trained' );
// Classify the test FeatureCollection.
var test = testingPartition.classify(trainedClassifier);

// Print the confusion matrix.
var confusionMatrix = test.errorMatrix('class', 'classification');
print('Confusion matrix:', confusionMatrix);
print('Overall Accuracy:', confusionMatrix.accuracy());
print('Producers Accuracy:', confusionMatrix.producersAccuracy());
print('Consumers Accuracy:', confusionMatrix.consumersAccuracy());

Map.centerObject(geometry)