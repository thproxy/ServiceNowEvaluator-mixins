# update-sets Examples

## ServiceNowEvaluator.prototype.exportUpdateSets

The sys_update_set GlideRecord will be passed to a function named filter so you
can mess with it however you want by providing that function.

```js
const e = new Evaluator(instance);
await e.login(username, password);
const results = await e.exportUpdateSets(function filter(gr) {
    gr.addQuery('name', 'CONTAINS', 'something');
});
```

## ServiceNowEvaluator.prototype.getUpdateSetStreams

This gives you streams for the exported update sets. Useful if you plan on saving
it to a local file or maybe sending it somewhere else.

```js
const e = new Evaluator(instance);
await e.login(username, password);
const results = await e.exportUpdateSets(function filter(gr) {
    gr.addQuery('name', 'CONTAINS', 'something');
});
const streams = await e.getUpdateSetStreams(ids);
```

## ServiceNowEvaluator.prototype.uploadUpdateSetStream

What do you know? This function takes a stream and then imports it to an instance,
similar to that little "Import Update Set from XML" page but since it's programmatic,
you can upload with speed and fashion.

```js
const e = new Evaluator(instance);
await e.login(username, password);
const results = await e.exportUpdateSets(function filter(gr) {
    gr.addQuery('name', 'CONTAINS', 'something');
});

// yeah, for some reason it turns out you cant use the stream from the previous method...
// well I have a reason to save to a local file too so its ok for me
await Promise.all(streams.map((stream, i) => new Promise((resolve) => {
    const file = fs.createWriteStream(`my update set ${i}.xml`);
    stream.pipe(file);
    stream.on('end', () => {
        const fileStream = fs.createReadStream(`my update set ${i}.xml`);
        resolve(e.uploadUpdateSetStream(fileStream));
    });
})));;
```
