# Frequently Asked Questions *supposedly*

## 1. **Do I have to install forbidden-node-logger?**
> No, simply replace the Logger Options when instantiating CommandClient as "false".

## 2. **Does my "/commands" file need to follow any sort of structure when using registerCommandsIn()?**
> Yes and no. The logic behind registerCommandsIn allows for 3 different types of locations.
> ```
> - /commands
>     command1.js
>     /Some random sentence
>         command2.js
>     /Another sentence
>         /Followed by another
>             command3.js
> ```
> You can name the files and folders anything. The only thing that has be named properyly is the root directory.\
> If your commands root is called "/commands" then you need to say so.
> ```js
> bot.registerCommandsIn(__dirname + "/commands");
> ```

## 3. **How can I keep the comments I leave my util functions?**
> A lot of research went into having a good implementation of the util manager.\
> Since TypeScript is very strict on it's declarations you will need to modify the `index.d.ts` file in `eris.js-commando` module.\
> There are other methods but this seems the most simply
> ```ts
> // THIS IS WHAT UTIL MANAGER SHOULD LOOK LIKE
> export class UtilManager {
>     bot: CommandClient;
>     useful: typeof Useful;
>     parse: typeof Parse;
>     database: typeof Database;
>     conversion: typeof Conversion;
>     // HOW YOU DEFINE IT
>     myfunctions: typeof MyFunctions;
>     constructor(bot: CommandClient);
>     bind(obj: object): void;
>     bindAll(): void;
>     checkProps(prop: string): boolean;
> }
> 
> // YOUR FUNCTIONS
> class MyFunctions {
>     /**
>      * My first function
>      * @param param My cool param
>     */ 
>     static functionOne(param: string): string[];
> }
> ```
> **THIS IS NOT REQUIRED BUT IF YOU WANT COMMENTS KEPT THIS IS THE EASIEST WAY**