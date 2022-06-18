![downloads](https://img.shields.io/npm/dm/lunar-lib)

# Lunar client launcher library

This is a javascript library to launch lunar client, without having the launcher installed

## How does it work?

It downloads all required files by mimicking the normal launcher, then launches

## Example

```typescript
async function main() {
  const lunar = await LunarLauncher.init();
  lunar.setVersion('1.7');
  await lunar.launch();
}

main();
```

## What doesnt work

The server `lunar.gg` currently does not work

## To the people at lunar

I'm not entirely sure if this is against your TOS, and I will take it down if you ask me to.
