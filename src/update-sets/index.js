const Evaluator = require('@thproxy/servicenow-evaluator');
const FormData = require('form-data');

const updateSetMixins = {
  /**
   * Exports update sets and gets their streams for download or other purposes
   * @param {*} ids ids of exported update sets to be exported
   * @returns an array of promises that resolve to streams
   */
  async getUpdateSetStreams(ids) {
    return Promise.all(ids.map((id) => this.fetch(`${this.instance}/export_update_set.do?${new URLSearchParams({
      sysparm_sys_id: id,
      sysparm_delete_when_done: true,
    })}`).then((res) => res.body)));
  },

  /**
   * Uploads an update set similar to importing a record from xml
   * @param {*} stream a stream of the update set
   * @returns the response of the server from the post request
   */
  async uploadUpdateSetStream(stream) {
    const fd = new FormData();
    // check if we can remove these
    fd.append('sysparm_upload_prefix', '');
    fd.append('sysparm_referring_url', '');
    fd.append('sysparm_target', 'sys_remote_update_set');
    fd.append(
      'attachFile',
      stream,
      // not important
      'the file name',
    );

    return this.fetch(`${this.instance}/sys_upload.do`, {
      body: fd,
      method: 'POST',
    });
  },

  /**
   * Export update sets that are returned by a GlideRecord modified by fn
   * @param {*} fn a function named filter to modify the glide record
   * @returns an array of {id, name} which represent the exports
   */
  async exportUpdateSets(fn) {
    const result = await this.evaluate(
      /* eslint-disable no-var, vars-on-top */
      // eslint-disable-next-line prefer-arrow-callback, func-names
      function () {
        // eslint-disable-next-line no-undef
        var updateSets = new GlideRecord('sys_update_set');
        // eslint-disable-next-line no-undef
        filter(updateSets);
        updateSets.query();

        var results = [];
        while (updateSets.next()) {
          // eslint-disable-next-line no-undef
          var updateSetExport = new UpdateSetExport();
          var sysId = updateSetExport.exportUpdateSet(updateSets);
          results.push({
            id: sysId,
            name: updateSets.getValue('name'),
          });
        }

        return results;
      },
      /* eslint-enable no-var */
      { scope: 'global', fnArgs: [fn] },
    );

    return JSON.parse(result.output);
  },
};

Object.assign(Evaluator.prototype, updateSetMixins);
