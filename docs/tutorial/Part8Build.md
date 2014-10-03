---
layout: default
title: Deliteful Tutorial Part 8
---
#Deliteful Tutorial (Part 8) - Building the Application for Production

We finished the development part of our example by adding a [settings view](Part7SettingsView.md).

If you open the debugging tools in your browser (usually F12), and look at the network traffic when you load the app,
 you will see a lot of HTTP requests to load each individual source file (`.js`, `.css`,  ...).
 This is OK while developing but when you deploy your application for production you will want to reduce the number
 and size of the HTTP requests so that your app loads as quickly as possible. We will now learn two alternative ways
 of doing this: using build versions of the dependency packages, or, even better, building the application code and
 its dependencies into a single layer file.

##Using Build Versions of Dependency Packages

> If you have chosen to get the tutorial application from the `ibm-js/deliteful-tutorial` project,
switch to the `part8-1` branch now:

```
$ git checkout part8-1
```

In the [first step](Part1GettingStarted.md) of the tutorial we chose to use the source versions of the dependency
packages, since this is usually easier for debugging and looking around in the code:

```
[?] Do you want to use build version of deliteful package (instead of source version)? No
```

We could have answered `y`, in that case the application would use the build version of all packages on which our
application depends. Build versions are functionnally equivalent but are packed into single layer files,
which reduces the number and size of HTTP requests.

Let's change our app to use build versions, as if we had answered `y` to the question aboce. If you chose to use build
versions from the beginning, you wouldn't need to do this of course.

First, we need to tell bower that we want to use build versions, not source versions. For this,
we simply change `deliteful` into `deliteful-build` in the `bower.json` file:

```js
{
	...
	"dependencies": {
		"deliteful-build": "0.3.x",
		...
}
```

Run bower again to load the build packages:

```
$ bower install
```

Now we need to slightly modify our code to use the build packages. In `js/app.js`,
wrap the existing `require` call inside another `require` call that loads the deliteful layer:

```js
require(["deliteful-build/boot"], function () {
	require([
		"delite/register", ...
	], function (register, ...) {
        ...
    });
});
```

Finally, modify `index.html` to change the path of the `defaultapp.css` stylesheet that we load directly from the
`delite` package:

```html
    <link rel="stylesheet" href="bower_components/delite-build/themes/defaultapp.css">
```

(as the build version of the delite package is now contained in `bower_components/delite-build` instead of
`bower_components/delite`).

Good, our app now uses build packages. It works the same, except it makes much less HTTP requests and loads faster.

##Building the Application Into a Single Layer

> If you have chosen to get the tutorial application from the `ibm-js/deliteful-tutorial` project,
switch to the `part8-1` branch now:

```
$ git checkout part8-2
```

> Otherwise, to follow the steps explained in this section, you need to restore the previous state of the app:

```
$ git checkout part7
```

We reduced the load time of our app, that's good, and it may be enough for many apps. But we can do even better by
generating a single `.js` file that will contain all the code of our app plus its dependencies. For this,
we will use the `ibm-js/grunt-amd-build` project, which provides a [Grunt](gruntjs.com) plugin that can generate our
 layer. The `grunt-amd-build` plugin is really powerful and flexible and provides many options,
 so to make things really easy, we will use another Yeoman generator, `ibm-js/generator-amd-build`,
 that will do the hard work for us.

 So let's install `ibm-js/generator-amd-build` first:

 ```
 $ npm install -g generator-amd-build
 ```

and run it:

```
$ yo amd-build
```

The generator asks some questions, you will mainly accept the defaults except for this one:

```
...
[?] Enter the id of your application main(s) modules(s)
 (use comma-separated list to add several): ../js/app
...
```

Our generator has created a `Gruntfile.js` that contains the configuration information for our build.

Let's run Grunt now to actually generate our layer:

```
$ grunt build
```

The output of the build is in the `build` directory, which now contains all the code and dependencies that we need,
so we need to modify our `index.html` as follows:

```js
    <script>
        require.config({
            baseUrl: "build/bower_components",
            ...
        });
    </script>
    <script src="build/bower_components/app/layer.js"></script>
```

If you launch the application now and look at the browser's debugger, you should see a minimal set of HTTP requests.
Our application is now fully optimized!

##Run the Demo

Click here to see the live demo of the fully optimized app:
[Deliteful Tutorial - Part 8.2](http://ibm-js.github.io/deliteful-tutorial/runnable/part8/index.html)

##Congratulations!

You have now completed this deliteful tutorial. More documentation and examples are available on the
[deliteful web site](http://ibm-js.github.io/deliteful/index.html).

[Previous Step - The Settings View](Part7SettingsView.md)
