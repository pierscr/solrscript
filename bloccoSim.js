var SolrNode=require('solr-node');


SolrNode.prototype.myUpdate = function(data,finalCallback) {
  console.log('myUpdate'+data);
  var bodyData;
  var  options = { commit: true,overwrite:true,wt:'json'}; // 'commit:true' option is default
  bodyData = data;
  this._requestPost("update", bodyData, options, finalCallback);
};

var clientLocalEscluster= new SolrNode({
    host:'localhost',
    port:8983,
    core:'sim_matrix'
});

var clientLocalEscluster2= new SolrNode({
    host:'solr:D1Sc0V3R1@217.172.12.219',
    port:8983,
    core:'sim_matrix_demo'
});

var q = clientLocalEscluster.query().q('*:*').rows(1000);

var data;

clientLocalEscluster.search(q,function(err,result){
  if(err){
    console.log(err);
    return
  }
  console.log('query search response length',result.response.docs.length);
  var newDataList=[];
  result.response.docs.forEach(function(item){
    console.log(item);
    try{
      newDataList.push(dataUpdate(item));
    }catch(err){
      console.log(err);
    }
  });

  clientLocalEscluster2.myUpdate(newDataList,function(err,response){
    if (err) {
     console.log(err);
     return;
    }
    console.info(response);
  });

  function dataUpdate(data){
    delete data._version_;
    return data;
  }

});
