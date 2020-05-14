//------------------------------------------------------------------------------
//  DAO for chain status
//------------------------------------------------------------------------------

module.exports = class ProgressDAO {

  constructor(execDir, client) {
    this.client = client;
    this.progressInfoCollection = 'progress';
  }

  upsertProgress(network, block_height, count, callback) {
    const queryObject = { '_id': network };
    const newObject = {
      'network': network,
      'lst_blk_height': block_height,
      'txs_count': count
    }
    this.client.upsert(this.progressInfoCollection, queryObject, newObject, callback);
  }
  getProgress(network, callback) {
    const queryObject = { '_id': network };
    this.client.findOne(this.progressInfoCollection, queryObject, function (error, record) {
      if (error) {
        console.log(error);
        callback(error);
      } else if (!record) {
        callback(Error('No progress record'));
      } else {
        var progressInfo = {};
        progressInfo.height = record.lst_blk_height;
        progressInfo.count = record.txs_count;
        callback(error, progressInfo);
      }
    })
  }

}