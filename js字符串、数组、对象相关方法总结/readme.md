### 案例分析
树形结构，选中后只保留最后一级信息，那么如何优雅的用代码实现呢？
![image](http://172.16.117.224/fe/ND-Share/raw/master/js%E5%AD%97%E7%AC%A6%E4%B8%B2%E3%80%81%E6%95%B0%E7%BB%84%E3%80%81%E5%AF%B9%E8%B1%A1%E7%9B%B8%E5%85%B3%E6%96%B9%E6%B3%95%E6%80%BB%E7%BB%93/image-1.png)

```
onCheck = (checkedKeys, e) => {
    let checkedNodes = [...e.checkedNodes]
    // 如果父级部门下有子级部门被选中，则仅保留子级部门，否则保留父级部门信息
    e.checkedNodes.forEach(item => {
        if (e.checkedNodes.some(ele => (item.key !== ele.key && ele.key.startsWith(item.key) && ele.key.charAt(item.key.length) === '-'))) {
            checkedNodes = checkedNodes.filter(i => i.key !== item.key)
        }
    })
    this.setState({
        checkedKeys,
        checkedNodes,
    })
}

onCancelCheck = (key, type) => {
    // 子级部门取消选中时，也取消选中父级部门
    let { checkedKeys, checkedNodes } = { ...this.state }
    checkedKeys = checkedKeys.filter(i => !(i === key || (key.startsWith(i) && key.charAt(i.length) === '-')))
    checkedNodes = checkedNodes.filter(i => i.key !== key)
    this.setState({
        checkedKeys,
        checkedNodes,
    })
}
```
### js字符串方法

**charAt(index)**
> 返回指定位置的字符

```
const str = 'hello world?'
str.charAt(2) // l
str.charAt(20) // ''
```
**charCodeAt(index)和codePointAt(index)**
> 返回指定位置的字符的 Unicode 编码,codePointAt可正确返回4字节字符的码点，而charCodeAt会将4字节字符当成2个双字节字符

```
const str = 'hello 𠮷'
str.charCodeAt(2) // 108
str.charCodeAt(6) // 55362
str.charCodeAt(7) // 57271
str.charCodeAt(20) // NaN
str.codePointAt(6) // 134071
```

**fromCharCode(unicodeNum, ...)和fromCodePoint(unicodeNum, ...)**
> 通过码点返回对应的字符，fromCodePoint可正确识别大于0*FFFF的码点

```
String.fromCharCode(104) //"h"
String.fromCharCode(134071) //"ஷ"
String.fromCodePoint(134071) //"𠮷"
```

**indexOf(str, index)**
> 用来确定一个字符串是否包含在另一个字符串中.如果没有,返回-1,index表示从哪个位置开始查找

```
const str = 'hello world'
str.indexOf('l') // 2
```

**lastIndexOf(str, index)**
> 返回字符串中一个子串最后一处出现的索引.如果没有,返回-1

```
const str = 'hello world'
str.lastIndexOf('l') // 9
```

**includes(str, index)**
> 返回布尔值,表示是否找到了参数字符串

**startsWith(str, index)**
> 返回布尔值,表示参数字符串是否在原字符串的头部

```
const str = 'hello world'
str.startsWith('hello') // true
str.startsWith('llo', 2) // true
```

**endsWith(str, n)**
> 返回布尔值,表示参数字符串是否在原字符串的尾部,n表示针对前n个字符

```
const str = 'hello world'
str.endsWith('world') // true
str.endsWith('el', 3) // true
```

**substring(start, end)**
> 截取从start到end(不包含)之间的字符串,如果参数是负数当0处理

**substr(start, length)**
> 截取从start开始截取长度为length的字符串,可识别参数负数

**slice(start,end)**
> 截取从start到end之间的字符串,可识别参数负数

> slice中的start如果为负数，会从尾部算起，-1表示倒数第一个，-2表示倒数第2个，此时end必须为负数，并且是大于start的负数，否则返回空字符串

> substring会取start和end中较小的值为start,二者相等返回空字符串，任何一个参数为负数被替换为0(即该值会成为start参数)

```
const str = 'hello world'
str.substring(1, 6) // "ello "
str.substring(1, -1) // "h"
str.substr(1, 6) // "ello w"
str.substr(1, -1) // ""
str.slice(-6, -1) //" worl"
str.slice(-6, -8) //""
```

**search(str || regExp)** 
> 正则搜索字符串,返回索引.如果没有,返回-1

**match(str || regExp)**
> 检查一个字符串匹配一个正则表达,如果没有,返回null

```
const str = 'hello world'
str.search(/ll/) // 2
str.match(/ll/) //["ll", index: 2, input: "hello world", groups: undefined]
```

**replace(str || regExp, replacement)**
> 在字符串中用一些字符替换另一些字符，或替换一个与正则表达式匹配的子串

```
const str = 'hello world'
str.replace(/ll/, 'hh') // "hehho world"
```

**split(separator, howmany)**
> 字符串转为数组

```
const str = 'hello world'
str.split(/l/, 2) // ["he", ""]
```
**toLowerCase()**
> 转小写

**toUpperCase()**
> 转大写

**repeat(n)**
> 返回一个新字符串,表示将原字符串重复n次

```
const str = 'hello world'
str.repeat(2) // "hello worldhello world"
str.repeat(-0.8) // ""
str.repeat(-1) // error
```

**padStart(length, str)和padEnd(length, str)**
> 如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。padStart和padEnd一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串。

```
const str = 'hello world'
str.padStart(15, 123) // "1231hello world"
str.padEnd(15, 123) // "hello world1231"
```

**String.raw**
> 在模板字符串中用于将转义字符进行转义

```
`Hi\n${2+3}!` //"Hi
                5!"
String.raw`Hi\n${2+3}!` //"Hi\n5!"
```

### js数组方法

**join(separator)**
> 数组转成字符串，和split互逆,不会改变原数组

**push()**
> 数组末尾新增元素,返回新增后数组,会改变原数组

**pop()**
> 数组移除末尾元素,返回移除项,会改变原数组

**shift()**
> 删除数组首项,返回删除项,会改变原数组

**unshift()**
> 数组首部新增元素,返回新增后数组,会改变原数组

**sort(func(a, b))**
> 对数组进行升序或者降序排列,会改变原数组

```
const arr = [23,12,1,34,116,8,18,37,56,50]
arr.sort() // [1, 116, 12, 18, 23, 34, 37, 50, 56, 8]
arr.sort((a, b) => a - b) // [1, 8, 12, 18, 23, 34, 37, 50, 56, 116]
arr.sort((a, b) => b - a) // [116, 56, 50, 37, 34, 23, 18, 12, 8, 1]
```

**reverse()**
> 对数组进行反转操作,会改变原数组

**concat()**
> 将参数添加到原数组中。这个方法会先创建当前数组一个副本，然后将接收到的参数添加到这个副本的末尾，最后返回新构建的数组。在没有给 concat()方法传递参数的情况下，它只是复制当前数组并返回副本。不会改变原数组。

```
const arr = [1,3,5,7]
arr.concat([9, [11, 13]]) // [1, 3, 5, 7, 9, Array[2]]
```


**slice(start, end)**
> 返回从原数组中指定开始下标到结束下标之间的项组成的新数组。slice()方法可以接受一或两个参数，即要返回项的起始和结束位置。在只有一个参数的情况下， slice()方法返回从该参数指定位置开始到当前数组末尾的所有项。如果有两个参数，该方法返回起始和结束位置之间的项——但不包括结束位置的项。不会改变原数组。

```
const arr = [1,3,5,7,9,11]
arr.slice(1,4) // [3, 5, 7]
arr.slice(1,-2) // [3, 5, 7]
```

**splice(start, n, value)**
> 返回删除,添加,修改元素后的数组

> 删除：可以删除任意数量的项，只需指定 2 个参数：要删除的第一项的位置和要删除的项数。例如， splice(0,2)会删除数组中的前两项。

> 插入：可以向指定位置插入任意数量的项，只需提供 3 个参数：起始位置、 0（要删除的项数）和要插入的项。例如，splice(2,0,4)会从当前数组的位置 2 开始插入4。

> 替换：可以向指定位置插入任意数量的项，且同时删除任意数量的项，只需指定 3 个参数：起始位置、要删除的项数和要插入的任意数量的项。插入的项数不必与删除的项数相等。例如，splice (2,1,6)会删除当前数组位置 2 的项，然后再从位置 2 开始插入6。

> 会改变原数组

```
const arr = [1,3,5,7,9,11]
const arr1 = arr.splice(0, 2) // arr: [5,7,9,11]
const arr2 = arr.splice(2, 0, 4) // arr: [5,7,4,9,11]
const arr3 = arr.splice(2, 1, 6) // arr: [5,7,6,9,11]
```

**indexOf(value, index)和 lastIndexOf(value, index)**
> indexOf()：接收两个参数：要查找的项和（可选的）表示查找起点位置的索引。其中， 从数组的开头（位置 0）开始向后查找。

> lastIndexOf：接收两个参数：要查找的项和（可选的）表示查找起点位置的索引。其中， 从数组的末尾开始向前查找。

**forEach()**
> 对数组进行遍历循环，对数组中的每一项运行给定函数。这个方法没有返回值。参数都是function类型，默认有传参，参数分别为：遍历的数组内容,对应的数组索引，数组本身。会改变原数组。

**map()**
> 对数组中的每一项运行给定函数，返回每次函数调用的结果组成的数组。不会改变原数组。

**filter()**
> “过滤”功能，数组中的每一项运行给定函数，返回满足过滤条件组成的数组。不会改变原数组。

```
const arr = [1, 3, 5, 3, 1, 5, 7]
arr.filter((item, index, self) => self.indexOf(item) === index) // [1, 3, 5, 7]
```


**every()**
> 判断数组中每一项都是否满足条件，只有所有项都满足条件，才会返回true。

**some()**
> 判断数组中是否存在满足条件的项，只要有一项满足条件，就会返回true。

**reduce()和 reduceRight()**
> 这两个方法都会实现迭代数组的所有项，然后构建一个最终返回的值。reduce()方法从数组的第一项开始，逐个遍历到最后。而 reduceRight()则从数组的最后一项开始，向前遍历到第一项。

> 这两个方法都接收两个参数：一个在每一项上调用的函数和（可选的）作为归并基础的初始值。传给 reduce()和 reduceRight()的函数接收 4 个参数：前一个值、当前值、项的索引和数组对象。

```
const arr = [1, 2, 3, 4, 5]
const sum = arr.reduceRight((prev, cur, index, array) => prev + cur, 10) // sum: 25
```

**find()**
> 找出第一个符合条件的数组元素，参数是一个回调函数，所有数组元素依次执行该回调函数，直到找出第一个返回值为 true 的元素，然后返回该元素。如果没有符合条件的元素，则返回 undefined。回调函数可以接受三个参数，依次为当前的值、当前的位置和原数组。

**findIndex()**
> findIndex 方法的用法与 find 方法非常类似，返回第一个符合条件的数组元素的位置，如果所有元素都不符合条件，则返回 -1。

```
[1, 5, 10, 15].find((value, index, arr) => value > 9) // 10
[1, 5, 10, 15].findIndex((value, index, arr) => value > 9) // 2
```


**Array.from()**
> 将类似数组的对象（array-like object）和可遍历（iterable）的对象转为真正的数组

```
Array.from({ length: 3 }) // [ undefined, undefined, undefined ]
Array.from({ length: 3 }, (v, i) => i) // [0, 1, 2]
```

**Array.of()**
> 用于将一组值，转换为数组

```
Array.of(1, 2, 3); // [1, 2, 3]
```

**includes(value, index)**
> 返回一个布尔值，表示某个数组是否包含给定的值，与字符串的includes方法类似。

```
[NaN].indexOf(NaN) // -1
[NaN].includes(NaN) // true
```

### js对象方法

**Object.is()**
> 它用来比较两个值是否严格相等，与严格比较运算符（===）的行为基本一致。不同之处只有两个：一是+0不等于-0，二是NaN等于自身。

```
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

**Object.getOwnPropertyDescriptor()**
> 返回某个对象属性的描述对象（descriptor）

```
const obj = {a: 1, b: 2}
Object.getOwnPropertyDescriptor(obj, 'a')
//
{
    configurable: true,
    enumerable: true,
    value: 1,
    writable: true,
}
```
> 描述对象的enumerable属性，称为”可枚举性“，如果该属性为false，就表示某些操作会忽略当前属性。

> 目前，有四个操作会忽略enumerable为false的属性。

    for...in循环：只遍历对象自身的和继承的可枚举的属性。
    Object.keys()：返回对象自身的所有可枚举的属性的键名。
    JSON.stringify()：只串行化对象自身的可枚举的属性。另外，undefined、任意的函数以及 symbol 值，在序列化过程中会被忽略（出现在非数组对象的属性值中时）或者被转换成 null（出现在数组中时）。
    Object.assign()：忽略enumerable为false的属性，只拷贝对象自身的可枚举的属性

**Object.assign()**
> 用于对象的合并，将源对象（source）的所有可枚举属性，复制到目标对象（target）

> Object.assign方法的第一个参数是目标对象，后面的参数都是源对象。如果目标对象与源对象有同名属性，或多个源对象有同名属性，则后面的属性会覆盖前面的属性。

> Object.assign拷贝的属性是有限制的，只拷贝源对象的自身属性（不拷贝继承属性），也不拷贝不可枚举的属性（enumerable: false）

```
Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
// // { b: 'c' }

Object.assign([1, 2, 3], [4, 5])
// [4, 5, 3]
```

**Object.keys()**
> 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键名。

**Object.values()**
> 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值。

**Object.entries**
> 返回一个数组，成员是参数对象自身的（不含继承的）所有可遍历（enumerable）属性的键值对数组。

```
const obj = {a: 1, b: 2}
Object.keys(obj) // ["a", "b"]
Object.values(obj) // [1, 2]
Object.entries(obj) // [["a", 1], ["b", 2]]
```

