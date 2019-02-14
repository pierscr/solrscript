var SolrNode=require('solr-node');

var clientLocalEscluster= new SolrNode({
    host:'localhost',
    port:8983,
    core:'sim_matrix'
});

var clientLocalEscluster2= new SolrNode({
    host:'217.172.12.219',
    port:8983,
    core:'sim_matrix'
});

var q = clientLocalEscluster.query().q('*:*').rows(1000);

var data;

clientLocalEscluster.search(q,function(err,result){
  if(err){
    console.log(err);
    return
  }
  console.log('Response',result.response.docs.length);
  data=result.response.docs;
  // var toAdd=data[0];
  // delete toAdd._version_;
  // delete toAdd.id;
  var totalIndex=0;
  var sendingIndex=0;
  data.forEach(function(item){

    setTimeout(myUpdate, 500,item);
  });

  function myUpdate(data){
    delete data._version_;    
    console.log("sending"+sendingIndex);
    sendingIndex++;
    clientLocalEscluster2.update(data,function(){
      if (err) {
       console.log(err);
       return;
      }
      console.log(totalIndex);
      totalIndex++;
    });
    console.log("mah");
  }

});
