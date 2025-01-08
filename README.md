
> [!WARNING]
> This code does not work anymore, and will not be updated any longer.

![downloads](https://img.shields.io/npm/dm/lunar-lib)

# Lunar client launcher library

This is a javascript library to launch lunar client, without having the launcher installed

## How does it work?

It downloads all required files by mimicking the normal launcher, then launches

## Example

```typescript
async function main() {
  const lunar = await LunarLauncher.init(); // fetch the versions, and other metadata from the launcher
  
  lunar.setVersion('1.7'); // this will set the requested version to 1.7, is 1.8 by default
  
  await lunar.launch(); // this will download all files, and then launch java
}

main();
```

## What doesnt work

The server `lunar.gg` currently does not work

## To the people at lunar

I'm not entirely sure if this is against your TOS, and I will take it down if you ask me to.
