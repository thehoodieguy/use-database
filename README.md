# use-database

A react hook to build sql-like database on react context.

## Install

```shell
npm install use-database
```

```shell
yarn add use-database
```

## Simple usage

On root component where you want to share your database, (Mostly on App.tsx)

```tsx
const App: React.FC = () => {
  const databaseHook = useDatabase();
  return (
    <DatabaseHookProvider value={databaseHook}>
      <BrilliantComponent />
    </DatabaseHookProvider>
  );
};
```

And use `useTable` for set or get resource from database.

```tsx
const POST_TABLE = 'POST'

interface Post {
  id: number;
  ...
}

function BrilliantComponent() {
  const { setRow, getRow } = useTable<Post>(POST_TABLE);
  ...
    setRow(post.id, post);
  ...
  return <div>{getRow(1)}</div>
}
```

Go [examples/src](https://github.com/thehoodieguy/use-database/tree/master/example/src) folder to check more.

## Motivation

Using APIs on react, it's a common problem to fetch same resource repeatedly, and seperate same resource on different local state.

Many use global state and save all data on it, but you don't have to.

You don't even have to use flux library like redux or mobx to share resource, use context and `useTable` will simply solve your problem.

## Documentation

- [API Documentation]()

## Depedencies

- react
- typescript

## For developers want to improve this library

```shell
yarn install
yarn test --watch
```

And feel free to reach me by an issue or a pull request!

Thank you.

## License

MIT
