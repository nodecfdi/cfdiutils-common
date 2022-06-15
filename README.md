# @nodecfdi/cfdiutils-common

[![Source Code][badge-source]][source]
[![Software License][badge-license]][license]
[![Latest Version][badge-release]][release]
[![Discord][badge-discord]][discord]

[source]: https://github.com/nodecfdi/cfdiutils-common

[badge-source]: https://img.shields.io/badge/source-nodecfdi%2Fcfdiutils--common-blue?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMTIgMTIgNDAgNDAiPjxwYXRoIGZpbGw9IiMzMzMzMzMiIGQ9Ik0zMiwxMy40Yy0xMC41LDAtMTksOC41LTE5LDE5YzAsOC40LDUuNSwxNS41LDEzLDE4YzEsMC4yLDEuMy0wLjQsMS4zLTAuOWMwLTAuNSwwLTEuNywwLTMuMiBjLTUuMywxLjEtNi40LTIuNi02LjQtMi42QzIwLDQxLjYsMTguOCw0MSwxOC44LDQxYy0xLjctMS4yLDAuMS0xLjEsMC4xLTEuMWMxLjksMC4xLDIuOSwyLDIuOSwyYzEuNywyLjksNC41LDIuMSw1LjUsMS42IGMwLjItMS4yLDAuNy0yLjEsMS4yLTIuNmMtNC4yLTAuNS04LjctMi4xLTguNy05LjRjMC0yLjEsMC43LTMuNywyLTUuMWMtMC4yLTAuNS0wLjgtMi40LDAuMi01YzAsMCwxLjYtMC41LDUuMiwyIGMxLjUtMC40LDMuMS0wLjcsNC44LTAuN2MxLjYsMCwzLjMsMC4yLDQuNywwLjdjMy42LTIuNCw1LjItMiw1LjItMmMxLDIuNiwwLjQsNC42LDAuMiw1YzEuMiwxLjMsMiwzLDIsNS4xYzAsNy4zLTQuNSw4LjktOC43LDkuNCBjMC43LDAuNiwxLjMsMS43LDEuMywzLjVjMCwyLjYsMCw0LjYsMCw1LjJjMCwwLjUsMC40LDEuMSwxLjMsMC45YzcuNS0yLjYsMTMtOS43LDEzLTE4LjFDNTEsMjEuOSw0Mi41LDEzLjQsMzIsMTMuNHoiLz48L3N2Zz4%3D

[license]: https://github.com/nodecfdi/cfdiutils-common/blob/main/LICENSE

[badge-license]: https://img.shields.io/github/license/nodecfdi/cfdiutils-common?logo=open-source-initiative&style=flat-square

[badge-release]: https://img.shields.io/npm/v/@nodecfdi/cfdiutils-common

[release]: https://www.npmjs.com/package/@nodecfdi/cfdiutils-common

[badge-discord]: https://img.shields.io/discord/459860554090283019?logo=discord&style=flat-square

[discord]: https://discord.gg/aFGYXvX

> Sub-library of @nodecfdi/cfdiutils for common structs and helpers

:us: The documentation of this project is in spanish as this is the natural language for intended audience.

:mexico: La documentación del proyecto está en español porque ese es el lenguaje principal de los usuarios.

## Acerca de @nodecfdi/cfdiutils-common

Librería para contener las estructuras de datos comunes, y utilerías o funciones de ayuda común. Inspirada por la
versión de php https://github.com/eclipxe13/CfdiUtils

## Instalación

### Node NPM

```shell
npm i @nodecfdi/cfdiutils-common --save
```

### Yarn NPM

```shell
yarn add @nodecfdi/cfdiutils-common --save
```

## Uso básico

```ts
import { CNode } from '@nodecfdi/cfdiutils-common';
// Creación de un nodo con atributos
const node = new CNode('root', {
    id: '1',
});
console.log(node.attributes().get('id')); // '1'
console.log(node.attributes().get('no-existe')); // cadena de caracteres vacia ''
console.log(node.attributes().get('no-existe') ? 'si' : 'no'); // 'no'
node.attributes().set('atributo', 'valor'); // establece el valor
node.attributes().delete('id'); // elimina el atributo 'id'
// recorrer la colección de atributos
node.attributes().forEach((attributeValue, attributeName) => {
    console.log(`${attributeName}: ${attributeValue}`);
});
```

## Objeto CNode

Esta es la estructura básica. Un nodo debe tener un nombre y esta propiedad no se puede cambiar. Su constructor admite
tres parámetros:

- `name: string`: Nombre del nodo, se eliminan espacios en blanco al inicio y al final, no permite vacíos.
- `attributes: Record<string, unknown>`: Objeto de elementos clave/valor que serán importados como atributos.
- `nodes: CNode[]`: Arreglo de elementos `CNode` que serán importados como nodos hijo.

## Atributos de nodos CAttributes

Se accede a sus atributos utilizando la forma de Map de javascript siguiendo estas reglas básicas:

- La lectura de un nodo siempre devuelve una cadena de caracteres aunque el atributo no exista.
- La escritura de un nodo es siempre con una cadena de caracteres, también puede ser un objeto que implemente el
  método `toString`

Los atributos se manejan con una colección de tipo `CAttributes` y se pueden obtener usando el método `attributes()` en
el objeto `CNode`.

## CNodes

Los nodos hijos se manejan a través de una colección de nodos `CNodes`. Se puede acceder al objeto `CNodes` usando el
método `children()` en el objeto `CNode`.

Cuando se itera el objeto en realidad se está iterando sobre la colección de nodos.

La clase `CNode` tiene estos métodos de ayuda que sirven para trabajar directamente sobre la colección CNodes:

- iterador: El método `foreach` se realiza sobre la colección de nodos.
- `addChild(node: CNode)`: Agrega un nodo en la colección de nodos.

## Contenido de texto

Tradicionalmente, los CFDI Regulares, CFDI de Retenciones e Información de Pagos, así como sus complementos,
siguen la estructura de elementos con valores en los atributos y sin texto.

Sin embargo, el SAT —en su infinita consistencia— tiene el *Complemento de facturas del sector de ventas al detalle*
disponible en <https://www.sat.gob.mx/consulta/76197/complemento-para-factura-electronica> donde, en lugar de poner
los valores en atributos, pone los valores en el contenido textual del elemento, además de otros cambios como usar
nombres de nodos en inglés.

Por lo anterior, se introdujo la interfaz `CNodeHasValueInterface` que contiene los métodos `value(): string` y
`setValue(valueString: string): void` con lo que se puede escribir y leer este contenido simple.
