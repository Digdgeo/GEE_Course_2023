//Javascript Básico

// Esto es un comentario de una línea
print('Hello world!');

/* 
Esto es la apertura de un comentario multilinea

var saludo = 'Hello GEE world!';
print(saludo);

Esto es el cierre de un comentario multilinea

*/

var number = 99;

print('El número es ' + number);

var lista = [0,1,2,3,4,5];
print('La lista es: ', lista);

var lista2 = [6, 7, 8, 9, 10];

var lista3 = lista.concat(lista2);

lista.forEach(function(i) {
  //console.log(i);
  print(i + 1)
});

print(lista3);


var Objeto = {
  name: 'Diego',
  notaMental: 'puh', 
  edad: 42, 
  hobbies: ['Mountain Bike', 'surf', 'llorar']
};

print('Dict:', Objeto);

// Function
var greet = function(name) {
    return 'Hello ' + name;
};
print(greet('World'));
