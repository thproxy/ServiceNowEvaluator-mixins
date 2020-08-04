# update-sets Examples

## ServiceNowEvaluator.prototype.exportUpdateSets

The sys_update_set GlideRecord will be passed to a function named filter so you
can mess with it however you want by providing that function.

```js
const e = new Evaluator(instance);
const results = await e.exportUpdateSets(function filter(gr) {
    gr.addQuery('name', 'CONTAINS', 'something');
});
```

## ServiceNowEvaluator.prototype.getUpdateSetStreams

This gives you streams for the exported update sets. Useful if you plan on saving
it to a local file or maybe sending it somewhere else.

```js
const e = new Evaluator(instance);
const results = await e.exportUpdateSets(function filter(gr) {
    gr.addQuery('name', 'CONTAINS', 'something');
});
const ids = results.map(({ id }) => id);
const streams = await e.getUpdateStreams(ids);
```

## ServiceNowEvaluator.prototype.uploadUpdateSetStream

What do you know? This function takes a stream and then imports it to an instance,
similar to that little "Import Update Set from XML" page but since it's programmatic,
you can upload with speed and fashion.

```js
const e = new Evaluator(instance);
const results = await e.exportUpdateSets(function filter(gr) {
    gr.addQuery('name', 'CONTAINS', 'something');
});
const ids = results.map(({ id }) => id);
const streams = await e.getUpdateStreams(ids);
streams.map(e.uploadUpdateSetStream);
```
