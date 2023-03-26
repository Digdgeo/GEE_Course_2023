var huelva = /* color: #98ff00 */ee.Geometry.Point([-6.964972161752138, 37.25176159857674]),
var  sevilla = /* color: #ffc82d */ee.Geometry.Point([-5.988562249642763, 37.38500377594985]),
var marisma = /* color: #d63000 */ee.Geometry.Polygon(
        [[[-6.422823473200374, 36.946160344923776],
          [-6.385744615778499, 36.90993307817382],
          [-6.387117906794124, 36.86270202585984],
          [-6.365145250544124, 36.85940574591439],
          [-6.351412340387874, 36.88577200402477],
          [-6.340426012262874, 36.904442596643285],
          [-6.306093736872249, 36.914325178892405],
          [-6.277254625544124, 36.92091285576746],
          [-6.278627916559749, 36.94506280191751],
          [-6.292360826715999, 36.960426965074305],
          [-6.293734117731624, 36.98237039270601],
          [-6.282747789606624, 37.0043074933439],
          [-6.284121080622249, 37.016370201309606],
          [-6.284121080622249, 37.03720127814646],
          [-6.278627916559749, 37.06788929321728],
          [-6.344545885309749, 37.07336798996112],
          [-6.372011705622249, 37.07555935783696],
          [-6.402224107965999, 37.086515247257175],
          [-6.435183092340999, 37.10732707477237],
          [-6.457155748590999, 37.09746955328667],
          [-6.451662584528499, 37.07008081940899],
          [-6.443422838434749, 37.021852617484015],
          [-6.443422838434749, 36.970302290384986]]]);


var huelva_buffer = huelva.buffer(50000)
var sevilla_buffer = sevilla.buffer(50000)
var marisma_buffer = marisma.buffer(25000)

Map.addLayer(huelva_buffer, {color:'red'})
Map.addLayer(sevilla_buffer, {color:'blue'})


// Compute the intersection, display it in green.
var intersection = huelva_buffer.intersection(sevilla_buffer);
Map.addLayer(intersection, {color: '00FF00'}, 'intersection');

// Compute the union, display it in magenta.
var union = huelva_buffer.union(sevilla_buffer, ee.ErrorMargin(1));
Map.addLayer(union, {color: 'FF00FF'}, 'union');

// Compute the difference, display in yellow.
var diff1 = huelva_buffer.difference(sevilla_buffer, ee.ErrorMargin(1));
Map.addLayer(diff1, {color: 'FFFF00'}, 'diff1');

// Compute symmetric difference, display in black.
var symDiff = huelva_buffer.symmetricDifference(sevilla_buffer).symmetricDifference(marisma_buffer, ee.ErrorMargin(1));
Map.addLayer(symDiff, {color: '000000'}, 'symmetric difference');

print('El area de la marisma es', marisma.area())
print('El centroide se encuentra en', marisma.centroid())

Map.addLayer(marisma.centroid(), {}, 'Centroide')
