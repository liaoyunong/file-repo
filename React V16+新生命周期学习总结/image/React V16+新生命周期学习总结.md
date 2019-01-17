![image](image/react.jpeg)

##### React 15 到 16 生命周期函数变动点

预废弃：

componentWillMount

componentWillUpdate

componentWillReceiveProps

已新增：

componentDidCatch(error, info) （v16.0）

static getDerivedStateFromProps(nextProps, prevState) （v16.3）

getSnapshotBeforeUpdate(prevProps, prevState) （v16.3）

UNSAFE_componentWillMount（v16.3）

UNSAFE_componentWillReceiveProps（v16.3）

UNSAFE_componentWillUpdate（v16.3）

static getDerivedStateFromError(error)（v16.6）

截止到目前（v16.6），共新增了上述几个生命周期函数，其中UNSAFE_前缀的生命周期主要是作为一种过渡手段方便后续废弃componentWillMount，componentWillReceiveProps 以及 componentWillUpdate

##### 废弃原因

先来看React v16.3之前的生命周期函数（图中实际上少了componentDidCatch)，如下图。

![image](image/react15.jpg)

到目前为止(React 16.6)，React的渲染机制遵循同步渲染: 

1) 首次渲染: willMount > render > didMount， 
2) props更新时: receiveProps > shouldUpdate > willUpdate > render > didUpdate 
3) state更新时: shouldUpdate > willUpdate > render > didUpdate 
3) 卸载时: willUnmount

可以看出这个生命周期函数非常的对称，有componentWilUpdate对应componentDidUpdate，有componentWillMount对应componentDidMount；也考虑到了因为父组件引发渲染可能要根据props更新state的需要，所以有componentWillReceiveProps。

但是，这个生命周期函数的组合在Fiber([React Fiber是什么
](http://172.16.117.224/fe/blog/issues/54))之后就显得不合适了，从v17开始，react会采取新的异步渲染机制，也就是Async Render，在dom真正render之前，React中的调度机制可能会不定期的去查看有没有更高优先级的任务，如果有，就打断当前的周期执行函数(哪怕已经执行了一半)，等高优先级任务完成，再回来重新执行之前被打断的周期函数。在这种情况下，在render之前的所有函数都有可能被执行多次。这种新机制对现存周期函数的影响就是它们的调用时机变的复杂而不可预测，这也就是为什么”UNSAFE”。

从框架的稳定性考虑，不重写现存的很成熟但不适应新机制的周期函数，另起炉灶为async render重新打造一套新周期函数也在情理之中。

##### React 16生命周期

所以在考虑废弃componentWillMount、componentWillUpdate、componentWillReceiveProps这三个周期函数以及在16.3版本增加了新的周期函数后，React v16.3的生命周期函数一览图成了这样。

![image](image/react16.3.jpg)

可以注意到，说getDerivedStateFromProps取代componentWillReceiveProps是不准确的，因为componentWillReceiveProps只在Updating过程中才被调用，而且只在因为父组件引发的Updating过程中才被调用；而getDerivedStateFromProps在Updating和Mounting过程中都会被调用。而且可以看出，在16.3的生命周期中，同样是Updating过程，如果是因为自身setState引发或者forceUpdate引发，而不是不由父组件引发，那么getDerivedStateFromProps也不会被调用。那么对于开发者来说就必须要区分这几种情况，没办法做到统一处理，所幸React也意识到这个问题，在V16.4中进行了改正，改正的结果，就是让getDerivedStateFromProps无论是Mounting还是Updating，也无论是因为什么引起的Updating，全部都会被调用。所以V16.4之后的生命周期就变成了下图所示：

![image](image/react16.4.png)

生命周期函数的调用逻辑就会变成：

1:初始化    

在组件初始化阶段会执行
1. constructor
2. static getDerivedStateFromProps()
3. componentWillMount() / UNSAFE_componentWillMount() （将废弃，但仍然会被调用）
4. render()
5. componentDidMount()

2.更新阶段

props或state的改变可能会引起组件的更新，组件重新渲染的过程中会调用以下方法：

1. componentWillReceiveProps() / UNSAFE_componentWillReceiveProps()（将废弃，但仍然会被调用）
2. static getDerivedStateFromProps()
3. shouldComponentUpdate()
4. componentWillUpdate() / UNSAFE_componentWillUpdate()（将废弃，但仍然会被调用）
5. render()
6. getSnapshotBeforeUpdate()
7. componentDidUpdate()

3.卸载阶段

1. componentWillUnmount()

4.错误处理

1. static getDerivedStateFromError()
2. componentDidCatch()

##### 生命周期函数详解

###### 1.constructor(props)

react组件的构造函数在挂载之前被调用。在实现React.Component构造函数时，需要先在添加其他内容前，调用super(props)，用来将父组件传来的props绑定到这个类中，使用this.props将会得到。

constructor中应当做些初始化的动作，如：初始化state，将事件处理函数绑定到类实例上，但也不要使用setState()。如果没有必要初始化state或绑定方法，则不需要构造constructor，或者把这个组件换成纯函数写法。

> 官方建议：不要在constructor引入任何具有副作用和订阅功能的代码，这些应当在componentDidMount()中写入。

###### 2.static getDerivedStateFromProps(nextProps, prevState)

getDerivedStateFromProps在组件实例化后，和接受新的props或者组件自身setState后被调用。他返回一个对象来更新状态，或者返回null表示新的props不需要任何state的更新。

getDerivedStateFromProps是一个静态函数，所以函数体内不能访问this，简单说，就是应该一个纯函数，输出完全由输入决定。

```
static getDerivedStateFromProps(nextProps, prevState) {
  // 根据nextProps和prevState计算出预期的状态改变，返回结果会被送给setState
  // calculate the expected state change according to nextProps and prevState，then the result will be sent to setState
}
```
看到这样的函数声明，应该感受到React的潜台词：**老实做一个运算就行，别在这里搞什么别的动作**。

一个简单的例子如下：

```
// before
componentWillReceiveProps(nextProps) {
  if (nextProps.isLogin !== this.props.isLogin) {
    this.setState({ 
      isLogin: nextProps.isLogin,   
    });
  }
  if (nextProps.isLogin) {
    this.handleClose();
  }
}

// after
static getDerivedStateFromProps(nextProps, prevState) {
  if (nextProps.isLogin !== prevState.isLogin) {
    return {
      isLogin: nextProps.isLogin,
    };
  }
  return null;
}

componentDidUpdate(prevProps, prevState) {
  if (!prevState.isLogin && this.props.isLogin) {
    this.handleClose();
  }
}
```
通常来讲，在 componentWillReceiveProps 中，我们一般会做以下两件事，一是根据 props 来更新 state，二是触发一些回调，如动画或页面跳转等。在老版本的 React 中，这两件事我们都需要在 componentWillReceiveProps 中去做。而在新版本中，官方将更新 state 与触发回调重新分配到了 getDerivedStateFromProps 与 componentDidUpdate 中，使得组件整体的更新逻辑更为清晰。而且在 getDerivedStateFromProps 中还禁止了组件去访问 this.props，强制让开发者去比较 nextProps 与 prevState 中的值，以确保当开发者用到 getDerivedStateFromProps 这个生命周期函数时，就是在根据当前的 props 来更新组件的 state，而不是去做其他一些让组件自身状态变得更加不可预测的事情。

所以对于现有 componentWillReceiveProps 中的代码如果想进行升级的话，只需要根据更新 state 或回调，分别在 getDerivedStateFromProps 及 componentDidUpdate 中进行相应的重写即可。

###### 3.componentWillMount() / UNSAFE_componentWillMount()

componentWillMount()将在react未来版本中被弃用。而UNSAFE_componentWillMount()只是作为弃用componentWillMount的一个过渡生命周期。

为了避免副作用和其他的订阅，官方都建议使用componentDidMount()代替。

###### 4.render()

render()方法是必需的。当他被调用时，他将计算this.props和this.state，并返回以下一种类型：

1. React元素。通过jsx创建，既可以是dom元素，也可以是用户自定义的组件。
2. 字符串或数字。他们将会以文本节点形式渲染到dom中。
3. Portals。react 16版本中提出的新的解决方案，可以使组件脱离父组件层级直接挂载在DOM树的任何位置。
4. null，什么也不渲染
5. 布尔值。也是什么都不渲染，通常后跟组件进行判断。
 
render()方法必须是一个纯函数，他不应该改变state，也不能直接和浏览器进行交互，应该将事件放在其他生命周期函数中。 如果shouldComponentUpdate()返回false，render()不会被调用。

###### 5.componentDidMount()

组件挂载后调用一次，请求或者事件监听可以放在这里。

###### 6.componentWillReceiveProps()/UNSAFE_componentWillReceiveProps(nextProps)

官方建议使用getDerivedStateFromProps函数代替componentWillReceiveProps()。当组件挂载后，接收到新的props后会被调用。如果需要更新state来响应props的更改，则可以进行this.props和nextProps的比较，并在此方法中使用this.setState()。

如果父组件会让这个组件重新渲染，即使props没有改变，也会调用这个方法。

react不会在组件初始化props时调用这个方法。调用this.setState也不会触发。

###### 7.shouldComponentUpdate(nextProps, nextState)

调用shouldComponentUpdate使react知道，组件的输出是否受state和props的影响。默认每个状态的更改都会重新渲染，大多数情况下应该保持这个默认行为。

在渲染新的props或state前，shouldComponentUpdate会被调用。默认为true。这个方法不会在初始化时被调用，也不会在forceUpdate()时被调用。

如果shouldComponentUpdate()返回false，componentwillupdate,render和componentDidUpdate不会被调用。

###### 8.componentWillUpdate()/UNSAFE_componentWillUpdate(nextProps, nextState)

在渲染新的state或props时，componentWillUpdate会被调用，将此作为在更新发生之前进行准备的机会。使用componentWillUpdate可能会带来两个问题：
1. 因为 props 改变而带来的副作用

与 componentWillReceiveProps 类似，许多开发者也会在 componentWillUpdate 中根据 props 的变化去触发一些回调。但不论是 componentWillReceiveProps 还是 componentWillUpdate，都有可能在一次更新中被调用多次，也就是说写在这里的回调函数也有可能会被调用多次，这显然是不可取的。与 componentDidMount 类似，componentDidUpdate 也不存在这样的问题，一次更新中 componentDidUpdate 只会被调用一次，所以将原先写在 componentWillUpdate 中的回调迁移至 componentDidUpdate 就可以解决这个问题。

2. 在组件更新前读取 DOM 元素状态

另一个常见的 componentWillUpdate 的用例是在组件更新前，读取当前某个 DOM 元素的状态，并在 componentDidUpdate 中进行相应的处理。但在 React 开启异步渲染模式后，render 阶段和 commit 阶段之间并不是无缝衔接的，也就是说在 render 阶段读取到的 DOM 元素状态并不总是和 commit 阶段相同，这就导致在 componentDidUpdate 中使用 componentWillUpdate 中读取到的 DOM 元素状态是不安全的，因为这时的值很有可能已经失效了。

为了解决上面提到的这个问题，React 提供了一个新的生命周期函数：

```
getSnapshotBeforeUpdate(prevProps, prevState)
```

###### 9.getSnapshotBeforeUpdate(prevProps, prevState)

与 componentWillUpdate 不同，getSnapshotBeforeUpdate 会在最终的 render 之前被调用，也就是说在 getSnapshotBeforeUpdate 中读取到的 DOM 元素状态是可以保证与 componentDidUpdate 中一致的。虽然 getSnapshotBeforeUpdate 不是一个静态方法，但我们也应该尽量使用它去返回一个值。这个值会随后被传入到 componentDidUpdate 中，然后我们就可以在 componentDidUpdate 中去更新组件的状态，而不是在 getSnapshotBeforeUpdate 中直接更新组件状态。

比如官方提供的一个例子如下：

```
class ScrollingList extends React.Component {
  listRef = null;

  getSnapshotBeforeUpdate(prevProps, prevState) {
    // Are we adding new items to the list?
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.list.length < this.props.list.length) {
      return (
        this.listRef.scrollHeight - this.listRef.scrollTop
      );
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    // If we have a snapshot value, we've just added new items.
    // Adjust scroll so these new items don't push the old ones out of view.
    // (snapshot here is the value returned from getSnapshotBeforeUpdate)
    if (snapshot !== null) {
      this.listRef.scrollTop =
        this.listRef.scrollHeight - snapshot;
    }
  }

  render() {
    return (
      <div ref={this.setListRef}>
        {/* ...contents... */}
      </div>
    );
  }

  setListRef = ref => {
    this.listRef = ref;
  };
}
```

如果我们想要将现有的 componentWillUpdate 中的回调函数迁移至 componentDidUpdate，如果触发某些回调函数时需要用到 DOM 元素的状态，则将对比或计算的过程迁移至 getSnapshotBeforeUpdate，然后在 componentDidUpdate 中统一触发回调或更新状态。

###### 10.componentDidUpdate(prevProps, prevState, snapshot)

在更新完成后调用componentDidUpdate()。此方法不用于初始渲染。当组件更新时，将此作为一个机会来操作DOM。

如果组件实现getSnapshotBeforeUpdate()生命周期，则它返回的值将作为第三个“快照”参数传递给componentDidUpdate()。否则，这个参数是undefined。

###### 11.componentWillUnmount()

组件被卸载之前调用。在此方法中执行任何必要的清理，例如使定时器无效，取消网络请求或清理在componentDidMount()中创建的任何监听。

###### 12.static getDerivedStateFromError(error)和componentDidCatch(error, info)

部分 UI 中的 JavaScript 错误不应该破坏整个应用程序。 为了解决 React 用户的这个问题，React 16引入了一个 “错误边界(Error Boundaries)” 的新概念。

错误边界是 React 组件，它可以 在子组件树的任何位置捕获 JavaScript 错误，记录这些错误，并显示一个备用 UI ，而不是使整个组件树崩溃。

如果一个类组件定义了生命周期方法中的任何一个（或两个）static getDerivedStateFromError() 或 componentDidCatch()，那么它就成了一个错误边界。 使用static getDerivedStateFromError()在抛出错误后渲染回退UI。 使用 componentDidCatch() 来记录错误信息。

```
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

then you can use it as a normal component:

```js
<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```
